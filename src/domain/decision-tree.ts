/***
* This file contains logic for constructing and evaluating decision trees.
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
  condition: Condition
  /** the nodes represent any additional logic that should be executed as "child code" of this node, like opening {} brackets */
  nodes: DecisionNode[]
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
  nodes: ExecutedDecisionNode[]
}

export const executeDecisionNode = (decisionNode: DecisionNode, data: unknown): ExecutedDecisionNode | DecisionNode => {
  let actionResults: ExecutedAction[] = []
  let executedNodes: (DecisionNode | ExecutedDecisionNode)[] = []
  // @ts-ignore for this exercise, ignoring specific property types
  const conditionResult = testCondition({ condition: decisionNode.condition, propertyValue: data[decisionNode.condition.targetPropertyName] })
  if(conditionResult){
    actionResults = decisionNode.actions.map(action => ({
      ...executeAction(action),
    }))
    if(decisionNode.nodes.length){
      executedNodes = decisionNode.nodes.map(node => {
        return executeDecisionNode(node, data)
      })
    }
    return {
      ...decisionNode,
      actions: actionResults,
      nodes: executedNodes,
    }
  } else if(decisionNode.elseActions && decisionNode.elseActions.length > 0){
    // `condition` was false and we have the action for else branch specified
    //
    // Note: we store the else branch results in `actionResult` too,
    // ..to avoid having two result fields but only one having results at once.
    actionResults = decisionNode.elseActions.map(action => ({
      ...executeAction(action),
    }))
    return {
      ...decisionNode,
      conditionResult,
      elseActions: actionResults,
      nodes: executedNodes,
    }
  } else {
    return decisionNode
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