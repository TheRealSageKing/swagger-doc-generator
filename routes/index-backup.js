var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.post("/generate", (req, res, next) => {
	console.log("Request body:", req.body);

	// Attempt to parse the request body as JSON
	try {
		const parsedBody = JSON.parse(req.body.payload);
		console.log("Parsed body:", parsedBody);
		const result = generateSwaggerSchema(parsedBody);
		return res.status(200).json({ response: result });
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return res.status(400).json({ error: "Invalid JSON payload" });
	}
});

function generateSwaggerSchema(responseObject) {
	const content = {
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {},
				},
			},
		},
	};

	const schema = { properties: {} };

	Object.keys(responseObject).forEach((key, index) => {
		if (responseObject.hasOwnProperty(key)) {
			const value = responseObject[key];
			let valueType;

			if (Array.isArray(value)) {
				valueType = "array";
				const arrayItemsType = Array.isArray(value[0]) ? "array" : typeof value[0];
				schema.properties[key] = {
					type: valueType,
					items: {
						type: arrayItemsType,
					},
				};
			} else {
				valueType = typeof value;
				schema.properties[key] = {
					type: valueType,
					example: responseObject[key],
				};
			}
		}
	});

	return {
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: schema.properties,
				},
			},
		},
	};
}

module.exports = router;
