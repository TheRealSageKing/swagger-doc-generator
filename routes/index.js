var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

router.post("/generate", (req, res, next) => {
	console.log("Request body:", req.body);
	const { success, error, body, summary, path, params, method, tag } = req.body;
	// Attempt to parse the request body as JSON
	try {
		const ok = success ? JSON.parse(success) : {};
		const err = error ? JSON.parse(error) : {};
		const rbody = body ? JSON.parse(body) : {};
		const parameters = params ? JSON.parse(params) : {};

		console.log("Parsed OK:", ok);
		console.log("Parsed Err:", err);
		console.log("Parsed body:", rbody);
		console.log("Parsed Summary:", summary);
		console.log("Parsed Endpoint:", path);

		const respOk = generateSwaggerSchema(ok);
		const respErr = generateSwaggerSchema(err);
		const reqBody = generateSwaggerSchema(rbody);
		const reqParams = generateSwaggerSchema(params);

		const swaggerDefinition = {
			[`${endpoint}`]: {
				summary: summary,
				description: "Login Path",
				[`${method}`]: {
					summary: "",
					tags: [`${tag}`],
					description: "",
					parameters: [
						{
							in: "path",
							name: "userId",
							schema: {
								type: "integer",
							},
							required: true,
							description: "Numeric ID of the user to get",
						},
					],
					requestBody: {
						required: true,
						content: {
							"application/json": {
								schema: {
									type: "object",
									properties: reqBody,
								},
							},
						},
					},
					responses: {
						201: {
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: respOk,
									},
								},
							},
						},
						400: {
							content: {
								"application/json": {
									schema: {
										type: "object",
										properties: respErr,
									},
								},
							},
						},
					},
				},
			},
		};

		return res.status(200).json({ response: swaggerDefinition });
	} catch (error) {
		console.error("Error parsing JSON:", error);
		return res.status(400).json({ error: "Invalid JSON payload" });
	}
});

function generateSwaggerSchema(responseObject) {
	let properties = {};
	Object.keys(responseObject).forEach((key, index) => {
		if (responseObject.hasOwnProperty(key)) {
			const value = responseObject[key];
			let valueType;

			if (Array.isArray(value)) {
				valueType = "array";
				const arrayItemsType = Array.isArray(value[0]) ? "array" : typeof value[0];
				properties[key] = {
					type: valueType,
					items: {
						type: arrayItemsType,
					},
				};
			} else {
				valueType = typeof value;
				properties[key] = {
					type: valueType,
					example: responseObject[key],
				};
			}
		}
	});

	return properties;
}

module.exports = router;
