/***
* This file contains code for decision tree actions (predefined code that should run when conditions evaluate to true).
*/

import { hasProperty, RequiredFields } from "./util"

export enum ActionType {
  SMSAction = 'SMSAction',
  EmailAction = 'EmailAction',
}

/**
* An Action is predefined code each with its own parameters, but standardized output.
*/
interface ActionBase {
  type: ActionType
  parameters: unknown
  executionResult?: ActionResult<unknown>
}

export interface SMSActionResult extends ActionResult<{ smsDeliveryReport: boolean }> {}
export interface SMSAction extends ActionBase {
  type: ActionType.SMSAction,
  parameters: { phoneNumber: string, smsMessage: string }
  /** SMSAction can have custom output data, smsDeliveryReport */
  executionResult?: SMSActionResult
}

export interface EmailActionResult extends ActionResult<{
  // put here any custom data output specifically for EmailAction actions
}> {}
export interface EmailAction extends ActionBase {
  type: ActionType.EmailAction,
  parameters: { emailAddress: string, subject: string, textBody: string }
  executionResult?: EmailActionResult
}
export type Action = SMSAction | EmailAction
export type ExecutedAction = RequiredFields<Action, 'executionResult'>

/**
* Results of executing an action.
*/
export interface ActionResult<ActionExecutionOutputType = null> {
  success: boolean;
  resultMessage: string;
  output: ActionExecutionOutputType;
}

/**
* List of all actions.
* for this exercise skipped generically typing `Function` below as (ActionBase['parameters']) => ActionResult.
*/
export const Actions: Record<keyof typeof ActionType, Function> = {
  SMSAction: (parameters: SMSAction['parameters']): SMSActionResult => {
    console.log('EXECUTED ACTION: SMSAction with parameters:', parameters)
    // skipping error handling
    console.log('ACTION STEP: send sms to ', parameters.phoneNumber)
    return {
      success: true,
      resultMessage: 'SMS sent!',
      output: {
        smsDeliveryReport: true
      }
    }
  },
  EmailAction: (parameters: EmailAction['parameters']): EmailActionResult => {
    console.log('EXECUTED ACTION: EmailAction with parameters:', parameters)
    // skipping error handling
    console.log('ACTION STEP: send email to ', parameters.emailAddress, 'with subject', parameters.subject, 'and text', parameters.textBody)
    return {
      success: true,
      resultMessage: 'Email sent!',
      output: {
        
      },
    }
  },
}

export const parseActionJSON = (data: unknown): Action => {
  // checking this one property as an example of what will be done
  if(!hasProperty(data, 'type')){
    throw new Error('Missing `type` attribute')
  }
  // @ts-ignore skipping fully parsing each action property for this exercise
  return data
}

export const executeAction = (action:Action): ExecutedAction => {
  const handler = Actions[action.type];
  return handler(action.parameters)
}