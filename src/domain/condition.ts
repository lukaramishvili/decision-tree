/***
* This file contains logic for constructing and evaluating Conditions (boolean logic) for decision trees.
*/

import dayjs from "dayjs";

export enum ComparisonType {
  directComparison = 'directComparison', // targetProperty == compareTo (not using === for simplicity)
  greaterThan = 'greaterThan', // targetProperty > compareTo (not using >= and <= for simplicity)
  lessThan = 'lessThan', // targetProperty < compareTo
}

/**
* A condition represents an `if`/`else` or `switch` test on `targetVariable` property of "data".
* Depending on `targetVariable`'s value, the corresponding `Action` will be executed.
* */
export interface Condition<ComparedPropertyType = unknown> {
  comparisonType: ComparisonType;
  /** what is the target property data type (we need this because comparison functions differ for strings, numbers, dates, etc) */
  targetPropertyType: 'string' | 'number' | 'date'
  /** which "data" property should be compared to this Condition's `compareTo` */
  targetPropertyName: string;
  /** the value to which to compare `targetProperty` */
  compareTo: ComparedPropertyType;
}

/**
* check if the condition evaluates to true for values of `number` data type.
*/
export const testNumberCondition = ({
  condition,
  propertyValue,
}: {
  condition: Condition<number>;
  propertyValue: number;
}) => {
  const { comparisonType: conditionType, compareTo } = condition;
  switch (conditionType) {
    case ComparisonType.directComparison:
    // console.log(`${propertyValue} == ${compareTo}, ${propertyValue == compareTo}`);
    return propertyValue == compareTo;
    case ComparisonType.greaterThan:
    // console.log(`${propertyValue} > ${compareTo}, ${propertyValue > compareTo}`);
    return propertyValue > compareTo;
    case ComparisonType.lessThan:
    // console.log(`${propertyValue} < ${compareTo}, ${propertyValue < compareTo}`);
    return propertyValue < compareTo;
    default:
    throw new Error(`Unsupported number condition conditionType ${conditionType}`);
  }
};

/**
* check if the condition evaluates to true for values of `number` data type.
* For greater/less-than logic, we compare the strings' lengths.
*/
export const testStringCondition = ({
  condition,
  propertyValue,
}: {
  condition: Condition<string>;
  propertyValue: string;
}) => {
  const { comparisonType: conditionType, compareTo } = condition;
  switch (conditionType) {
    case ComparisonType.directComparison:
    // console.log(`${propertyValue} == ${compareTo}, ${propertyValue == compareTo}`);
    return propertyValue == compareTo;
    case ComparisonType.greaterThan:
    // console.log(`${propertyValue} > ${compareTo}, ${propertyValue > compareTo}`);
    return propertyValue.length > compareTo.length;
    case ComparisonType.lessThan:
    // console.log(`${propertyValue} < ${compareTo}, ${propertyValue < compareTo}`);
    return propertyValue.length < compareTo.length;
    default:
    throw new Error(`Unsupported string condition conditionType ${conditionType}`);
  }
};

/**
* check if the condition evaluates to true for values of `Date` data type.
* for this exercise, we only compare dates (days) here, and not datetimes or hours.
*/
export const testDateCondition = ({
  condition,
  propertyValue,
}: {
  condition: Condition<Date>;
  propertyValue: Date;
}) => {
  const { comparisonType: conditionType, compareTo } = condition;
  switch (conditionType) {
    case ComparisonType.directComparison:
    // console.log(`${propertyValue} == ${compareTo}, ${dayjs(propertyValue).isSame(dayjs(compareTo), 'day')}`);
    return dayjs(propertyValue).isSame(dayjs(compareTo), 'day');
    case ComparisonType.greaterThan:
    // console.log(`${propertyValue} > ${compareTo}, ${dayjs(propertyValue).isAfter(dayjs(compareTo))}`);
    return dayjs(propertyValue).isAfter(dayjs(compareTo));
    case ComparisonType.lessThan:
    // console.log(`${propertyValue} < ${compareTo}, ${dayjs(propertyValue).isBefore(dayjs(compareTo))}`);
    return dayjs(propertyValue).isBefore(dayjs(compareTo));
    default:
    throw new Error(`Unsupported date condition conditionType ${conditionType}`);
  }
};

type TestConditionParams<T> = {condition: Condition<unknown>, propertyValue: unknown }
export const testCondition = (params: TestConditionParams<unknown>) => {
  const {condition, propertyValue } = params;
  switch(condition.targetPropertyType){
    case 'date':
    // @ts-ignore we know the data is correct, zod validator will also check it, so we can ignore TypeScript checking
    return testDateCondition(params as TestConditionParams<Date>)
    case 'number':
    // @ts-ignore we know the data is correct, zod validator will also check it, so we can ignore TypeScript checking
    return testNumberCondition(params as TestConditionParams<number>)
    case 'string':
    // @ts-ignore we know the data is correct, zod validator will also check it, so we can ignore TypeScript checking
    return testStringCondition(params as TestConditionParams<string>)
    default:
    throw new Error(`Unsupported targetPropertyType '${condition.targetPropertyType}' in condition ${JSON.stringify(condition)}`);
  }
}