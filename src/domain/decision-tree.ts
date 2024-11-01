/***
* This file contains logic for constructing and evaluating decision trees.
*
* Since we're basically constructing a programming language, it has:
* - execution flow (conditionals and looping, the "code")
* - context (that contains the incoming variables/properties of the "data").
*
*/

import { Action, ActionResult, executeAction, ExecutedAction } from "./action";
import { Condition, testCondition } from "./condition";
import { hasProperty } from "./util";

/** DecisionNode repesents one point of execution (e.g. one if/else check, or one loop),
* similar to one line (statement) of code.
*/
export interface DecisionNode {
  condition: Condition
  /** the nodes represent any additional logic that should be executed as "child code" of this node, like opening {} brackets */
  nodes: DecisionNode[]
  action: Action
}

/**
* DecisionTree is the same as DecisionNode, because it has one line of code and sub-lines,
* but it has a name as an identifier for admin panels etc.
*/
export interface DecisionTree extends DecisionNode {
  /** this field gives a name to the full decision tree, e.g. "Christmas Bonus Detector" */
  name: string;
}

export interface ExecutedDecisionNode extends DecisionNode {
  action: ExecutedAction
  nodes: ExecutedDecisionNode[]
}

export const executeDecisionNode = (decisionNode: DecisionNode, data: unknown): ExecutedDecisionNode | DecisionNode => {
  let actionResult: ExecutedAction = {
    ...decisionNode.action,
    executionResult: {
      output: {
        // faking as if all actions have the same parameterts for this exercise
        smsDeliveryReport: false,
      },
      resultMessage: 'N/A',
      success: false
    }
  }
  let executedNodes: (DecisionNode | ExecutedDecisionNode)[] = []
  // @ts-ignore for this exercise, ignoring specific property types
  if(testCondition({ condition: decisionNode.condition, propertyValue: data[decisionNode.condition.targetPropertyName] })){
    actionResult = executeAction(decisionNode.action)
    if(decisionNode.nodes.length){
      executedNodes = decisionNode.nodes.map(node => {
        return executeDecisionNode(node, data)
      })
    }
  }
  return {
    ...decisionNode,
    action: actionResult,
    nodes: executedNodes,
  }
}

export const parseDecisionTreeJSON = (data: unknown): DecisionTree | DecisionNode => {
  // checking this one property as an example of what will be done
  if(!hasProperty(data, 'name')){
    throw new Error('Missing `type` attribute')
  }
  // @ts-ignore skipping fully parsing each action property for this exercise
  return data
}