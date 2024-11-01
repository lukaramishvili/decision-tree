import dayjs from "dayjs";
import express, { Request, Response } from "express";
import { string, z } from "zod";
import { Actions } from "./domain/action";
import { Condition, ComparisonType, testNumberCondition, testDateCondition } from "./domain/condition";
import { executeDecisionNode, parseDecisionTreeJSON } from "./domain/decision-tree";
var bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

app.get("/condition/number", (req: Request, res: Response) => {
  const cond1: Condition<number> = {
    compareTo: 30.0,
    targetPropertyName: "age",
    targetPropertyType: 'number',
    comparisonType: ComparisonType.directComparison,
  };
  const cond2: Condition<number> = {
    compareTo: 50,
    targetPropertyName: "age",
    targetPropertyType: 'number',
    comparisonType: ComparisonType.greaterThan,
  };
  const cond3: Condition<number> = {
    compareTo: 50,
    targetPropertyName: "age",
    targetPropertyType: 'number',
    comparisonType: ComparisonType.lessThan,
  };
  const data = {
    age: 30,
  };
  const results = [
    testNumberCondition({
      condition: cond1,
      propertyValue: data.age,
    }),
    testNumberCondition({
      condition: cond2,
      propertyValue: data.age,
    }),
    testNumberCondition({
      condition: cond3,
      propertyValue: data.age,
    }),
  ];
  res.send(results);
});

app.get("/condition/date", (req: Request, res: Response) => {
  const cond1: Condition<Date> = {
    compareTo: dayjs().toDate(),
    targetPropertyName: "day",
    targetPropertyType: 'date',
    comparisonType: ComparisonType.directComparison,
  };
  const cond2: Condition<Date> = {
    compareTo: dayjs('2020-01-01').toDate(),
    targetPropertyName: "day",
    targetPropertyType: 'date',
    comparisonType: ComparisonType.greaterThan,
  };
  const cond3: Condition<Date> = {
    compareTo: dayjs('2020-01-01').toDate(),
    targetPropertyName: "day",
    targetPropertyType: 'date',
    comparisonType: ComparisonType.lessThan,
  };
  const data = {
    day: dayjs().toDate(),
  };
  const results = [
    testDateCondition({
      condition: cond1,
      propertyValue: data.day,
    }),
    testDateCondition({
      condition: cond2,
      propertyValue: data.day,
    }),
    testDateCondition({
      condition: cond3,
      propertyValue: data.day,
    }),
  ];
  res.send(results);
});

app.get("/action/sms", (req: Request, res: Response) => {
  const result = {}
  res.send(result);
});

const actionValidator = z.object({
  // @ts-ignore zod enum doesn't directly understand string arrays
  // https://github.com/colinhacks/zod/discussions/839#discussioncomment-6488540
  type: z.enum(Object.keys(Actions)),
  parameters: z.unknown(),
})
const conditionValidator = z.object({
  // @ts-ignore zod enum string array (link below)
  comparisonType: z.enum(Object.keys(ComparisonType)),
  targetPropertyName: z.string(),
  // from Condition['targetPropertyType']
  targetPropertyType: z.enum(['string', 'number', 'date']),
  compareTo: z.unknown(),
})
let nodeValidator = z.object({
  condition: conditionValidator,
  action: actionValidator,
  elseAction: actionValidator.optional(),
});
nodeValidator = nodeValidator.extend({
  // sub-branches of logic
  nodes: z.array(nodeValidator).optional()
});
const rootNodeValidator = nodeValidator.extend({
  name: z.string(),
})
app.post("/execute-decision-tree", (req: Request, res: Response) => {
  const payloadSchema = z.object({
    decisionTree: rootNodeValidator,
    data: z.object({
      currentDay: z.coerce.date(),
    })
  });
  const { data: payload, success: successParsing, error: errorParsing } = payloadSchema.safeParse(req.body);
  if(!successParsing){
    res.status(422).json({ error: errorParsing })
    return
  }
  console.log('REQUEST execute decision tree: ', payload.decisionTree.name, '. payload:', payload)
  const { data } = payload
  const decisionTree = parseDecisionTreeJSON(payload.decisionTree)
  const result = executeDecisionNode(decisionTree, data)
  console.log('RESULT executing decision tree:', payload.decisionTree.name, { result })
  res.json(result)
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
