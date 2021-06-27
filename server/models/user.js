module.exports = (User) => {
	User.validatesPresenceOf("username", "password");
	User.validatesUniquenessOf("username", {
		message: "User already exists",
	});

	// login
	User.login = async (username, password) => {
		return User.findOne({ where: { username, password } });
	};

	User.remoteMethod("login", {
		accepts: [
			{ arg: "username", type: "string" },
			{ arg: "password", type: "string" },
		],
		returns: { arg: "user", type: "User" },
		http: { path: "/login", verb: "post" },
	});

	User.afterRemote("login", (context, remoteMethodOutput, next) => {
		if (!context.result.user) {
			return next({
				message: "User not found",
			});
		}
		next();
	});

	const enabledRemoteMethods = [
		"patchOrCreate",
		"upsertWithWhere",
		"updateAll",
		"count",
		"prototype.patchAttributes",
		"createChangeStream",
		"replaceOrCreate",
		"exists",
		"replaceById",
	];
	User.sharedClass.methods().forEach((method) => {
		console.log(method.stringName);
		const methodName = method.stringName.replace(/.*?(?=\.)/, "").substr(1);
		if (enabledRemoteMethods.indexOf(methodName) !== -1) {
			User.disableRemoteMethodByName(methodName);
		}
	});
};
