function generateSwaggerSchema(responseObject) {
	const schema = {
		type: "object",
		properties: {},
	};

	for (const key in responseObject) {
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
			} else if (typeof value === "object" && value !== null) {
				schema.properties[key] = generateSwaggerSchema(value);
			} else {
				valueType = typeof value;
				schema.properties[key] = {
					type: valueType,
				};
			}
		}
	}

	return schema;
}

// Example API response object
const responseObject = {
	id: 1,
	name: "John Doe",
	email: "johndoe@example.com",
	roles: ["admin", "user"],
	permissions: [["read", "write"], ["delete"]],
	address: {
		street: "123 Main St",
		city: "Anytown",
		country: "USA",
	},
};

// Generate Swagger schema object
const swaggerSchema = generateSwaggerSchema(responseObject);

console.log(JSON.stringify(swaggerSchema, null, 2));
