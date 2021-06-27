module.exports = (Task) => {
	Task.validatesPresenceOf("name");
	Task.validatesPresenceOf("userId");

	// custom create
	Task.beforeRemote("create", (ctx, opt, next) => {
		const name = ctx.args.data.name;
		const userId = ctx.args.data.userId;
		Task.findOne({ where: { name, userId } }, (err, task) => {
			if (err) {
				return next(err);
			}
			if (task) {
				return next({
					message: "Task already exist!",
				});
			}
			next();
		});
	});

	Task.afterRemoteError("create", (ctx, next) => {
		if (ctx.error.details) {
			return next({
				statusCode: ctx.error.statusCode,
				message: ctx.error.details.messages,
			});
		}
		next();
	});

	// deleteById
	Task.delete = async (id) => {
		return Task.destroyById(id);
	};

	Task.remoteMethod("delete", {
		accepts: [{ arg: "id", type: "string" }],
		returns: { arg: "data", type: "string" },
		http: { path: "/delete/:id", verb: "delete" },
	});

	Task.beforeRemote("delete", (ctx, opt, next) => {
		const id = ctx.args.id;
		Task.findById(id, {}, (err, task) => {
			if (err) {
				return next(err);
			}
			if (!task) {
				return next({
					statusCode: 404,
					message: "Task not found",
				});
			}
			next();
		});
	});

	Task.beforeRemote("prototype.patchAttributes", (ctx, opt, next) => {
		console.log(ctx);
		const userId = ctx.args.data.userId || "";
		const name = ctx.args.data.name || "";

		if (!name) {
			return next({
				statusCode: 400,
				message: "name task is required!",
			});
		}

		if (!userId) {
			return next({
				statusCode: 400,
				message: "ID user is required!",
			});
		}

		Task.findOne({ where: { name, userId } }, (err, task) => {
			if (err) {
				return next(err);
			}
			if (task) {
				return next({
					message: "Task already exist!",
				});
			}
			next();
		});
	});

	const enabledRemoteMethods = [
		"patchOrCreate",
		"upsertWithWhere",
		"updateAll",
		"count",
		// "prototype.patchAttributes",
		"createChangeStream",
		"replaceOrCreate",
		"exists",
		"replaceById",
		"deleteById",
	];

	Task.sharedClass.methods().forEach((method) => {
		const methodName = method.stringName.replace(/.*?(?=\.)/, "").substr(1);
		if (enabledRemoteMethods.indexOf(methodName) !== -1) {
			Task.disableRemoteMethodByName(methodName);
		}
	});
};
