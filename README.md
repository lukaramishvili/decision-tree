# home-task
# Test task: Decision tree

#### What was done:
see PDF for the complete exercise.

#### What was omitted:

- some TypeScript types were ignored
- parsing works but doesn't exactly validate each parameter (to save time)

# How to run:

First, run the following commands:
```
yarn install
yarn start
```

Then, POST the following JSONs to `localhost:3000/execute-decision-tree`:

#### JSON 1: Christmas Detector

In this example, `currentDay` and `compareTo` dates are the same date, so the `true` branch actions are executed.

`POST` `/execute-decision-tree`:

```
{
	"decisionTree": {
		"name": "ChristmasDetector",
		"condition": {
			"comparisonType": "directComparison",
			"targetPropertyName": "currentDay",
			"targetPropertyType": "date",
			"compareTo": "2024-10-30T00:00:00.000Z"
		},
		"actions": [
			{
				"type": "SMSAction",
				"parameters": {
					"phoneNumber": "+995599431331"
				}
			}
		],
		"elseActions": [
			{
				"type": "SMSAction",
				"parameters": {
					"phoneNumber": "+9955--00--"
				}
			}
		],
		"nodes": []
	},
	"data": {
		"currentDay": "2024-10-30T10:42:33.740Z"
	}
}
```

You will receive the following JSON response with execution results:

```
{
	"name": "ChristmasDetector",
	"action": {
		"success": true,
		"resultMessage": "SMS sent!",
		"output": {
			"smsDeliveryReport": true
		}
	},
	"condition": {
		"comparisonType": "directComparison",
		"targetPropertyName": "currentDay",
		"targetPropertyType": "date",
		"compareTo": "2024-10-30T00:00:00.000Z"
	},
	"nodes": []
}
```

#### JSON 2: Multiple Notifications.

This example will execute multiple actions: 1) SMS 2) Email 3) another SMS

`POST` `/execute-decision-tree`:

```
{
	"decisionTree": {
		"name": "MultipleNotifications",
		"condition": {
			"comparisonType": "directComparison",
			"targetPropertyName": "currentDay",
			"targetPropertyType": "date",
			"compareTo": "2024-10-30T00:00:00.000Z"
		},
		"actions": [
			{
				"type": "SMSAction",
				"parameters": {
					"phoneNumber": "+995599431331"
				}
			},
			{
				"type": "EmailAction",
				"parameters": {
					"email": "luka.ramishvili@gmail.com",
					"subject": "Welcome to DecisionTree.com",
					"textBody": "this is an HTML email"
				}
			},
			{
				"type": "SMSAction",
				"parameters": {
					"phoneNumber": "+995599431331"
				}
			}
		],
		"elseActions": [
			{
				"type": "SMSAction",
				"parameters": {
					"phoneNumber": "+9955--00--"
				}
			}
		],
		"nodes": []
	},
	"data": {
		"currentDay": "2024-10-30T10:42:33.740Z"
	}
}
```

And you'll receive the result with multiple action results:

```
{
	"condition": {
		"comparisonType": "directComparison",
		"targetPropertyName": "currentDay",
		"targetPropertyType": "date",
		"compareTo": "2024-10-30T00:00:00.000Z"
	},
	"actions": [
		{
			"success": true,
			"resultMessage": "SMS sent!",
			"output": {
				"smsDeliveryReport": true
			}
		},
		{
			"success": true,
			"resultMessage": "Email sent!",
			"output": {}
		},
		{
			"success": true,
			"resultMessage": "SMS sent!",
			"output": {
				"smsDeliveryReport": true
			}
		}
	],
	"elseActions": [
		{
			"type": "SMSAction",
			"parameters": {
				"phoneNumber": "+9955--00--"
			}
		}
	],
	"nodes": [],
	"name": "MultipleNotifications"
}
```
