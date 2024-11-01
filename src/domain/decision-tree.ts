/***
* This file contains logic for constructing and executing decision trees.
*
* Since we're basically constructing a programming language, it has:
* - execution flow (conditionals and looping, the "code")
* - context (that contains the incoming variables/properties of the "data").
*
*/

import { Action, executeAction, ExecutedAction } from "./action";
import { Condition, testCondition } from "./condition";
import { hasProperty } from "./util";

/** DecisionNode repesents one point of execution (e.g. one if/else check, or one loop),
* similar to one line (statement) of code.
*/
export interface DecisionNode {
  /** this condition will be checked and determine which should run, `actions` or `elseActions` */
  condition: Condition
  /** allow looping (running this decision node more than once, checking again `condition` on each run):
  * 1. `untilConditionFalse` will behave like `while(condition)`
  * 2. if it's a `number`, it will behave like `(for i = 0; i < repeatCount; i++)`
  * 3. if it's `0` or `undefined`, then it's run only once
  * 4. if we wanted to loop without checking `condition`,
  * ... then we should duplicate the Action in the `actions` array, or add `repeatCount` to `Action` itself.
  */
  repeatCount?: /*'untilConditionFalse' | 0 | */ number;
  /** the nodes represent any additional logic that should be executed as "child code" of this node, like opening {} brackets */
  subActions: Action[]
  subtreeOutputs?: (Action | ExecutedAction)[][]
  /** what to do when `condition` evaluates to true */
  actions: Action[]
  /** what to do when `condition` evaluates to false */
  elseActions?: Action[]
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
  /** what the condition evaluated to. */
  conditionResult: boolean
  actions: ExecutedAction[]
  subActions: ExecutedAction[]
}

export const executeDecisionNode = (decisionNode: DecisionNode, data: unknown): ExecutedDecisionNode | DecisionNode => {
  let actionResults: ExecutedAction[] = []
  let executedSubActions: (Action | ExecutedAction)[][] = []
  let output: DecisionNode | ExecutedDecisionNode
  // @ts-ignore for this exercise, ignoring specific property types
  const checkCondition = () => testCondition({ condition: decisionNode.condition, propertyValue: data[decisionNode.condition.targetPropertyName] })
  const conditionResult = checkCondition()
  if(conditionResult){
    actionResults = decisionNode.actions.map(action => ({
      ...executeAction(action),
    }))
    output = {
      ...decisionNode,
      actions: actionResults,
    }
  } else if(decisionNode.elseActions && decisionNode.elseActions.length > 0){
    // `condition` was false and we have the action for else branch specified
    //
    // Note: we store the else branch results in `actionResult` too,
    // ..to avoid having two result fields but only one having results at once.
    actionResults = decisionNode.elseActions.map(action => ({
      ...executeAction(action),
    }))
    output = {
      ...decisionNode,
      conditionResult,
      elseActions: actionResults,
    }
  } else {
    output = decisionNode
  }
  //
  // Execute sub-tree of actions
  //
  if(decisionNode.repeatCount && decisionNode.repeatCount > 0 && decisionNode.subActions.length){
    /** function which executes the subtree once */
    const executeSubActions = (): (Action | ExecutedAction)[] => {
      return decisionNode.subActions.map(subAction => {
        if(checkCondition()){
          return executeAction(subAction)
        } else {
          return subAction
        }
      })
    }
    /** push each subtree execution into output.
     */
    console.log('START LOOP: subtree')
    for(let i = 0; i < decisionNode.repeatCount; i++){
      console.log(`LOOP ITERATION ${i}: subtree`)
      executedSubActions.push(executeSubActions())
    }
    console.log('END LOOP: subtree')
    output.subtreeOutputs = executedSubActions
  }
  return output
}

export const parseDecisionTreeJSON = (data: unknown): DecisionTree | DecisionNode => {
  // checking this one property as an example of what will be done
  if(!hasProperty(data, 'name')){
    throw new Error('Missing `type` attribute')
  }
  // @ts-ignore skipping fully parsing each action property for this exercise
  return data
}