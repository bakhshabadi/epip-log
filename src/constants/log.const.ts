export const getDetailsCall = function (err) {
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
        return stack;
    };
    var stack = err.stack;

    return (stack as any).map(f => {
        let fileName = f.getFileName()?.split("\\dist\\");
        if (fileName?.length) {
            fileName = fileName[1];
        } else {
            fileName = f.getFileName()
        }

        return {
            className: err?.constructor?.name,
            fileName,
            methodName: f.getMethodName(),
            lineNumber: f.getLineNumber(),
        }
    })[0];
}