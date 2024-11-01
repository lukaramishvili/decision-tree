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

Then, POST the following JSONs to `localhost:3000`:

#### JSON 1: Christmas Detector

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
		"action": {
			"type": "SMSAction",
			"parameters": {
				"phoneNumber": "+995599431331"
			}
		},
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

#### JSON 2: Christmas Detector

