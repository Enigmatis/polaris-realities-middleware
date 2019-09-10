import {IMiddleware} from "graphql-middleware";

const realityIdHeaderName: string = "reality-id";
const includeLinkedOperHeaderName: string = "include-linked-oper";

const realitiesMiddleware: IMiddleware = async (resolve: any, root: any, args: any, context: any, info: any) => {
    const result = await resolve(root, args, context, info);
    const operationalRealityId: number = 0;
    const noRealityIdOrSameAsHeader = entity => entity.realityId == undefined || entity.realityId == context.realityId;
    if (!root) { // assert that its a root resolver
        if (result instanceof Array) {
            return result.filter(noRealityIdOrSameAsHeader);
        } else {
            if (noRealityIdOrSameAsHeader(result))
                return result;
        }
    } else {
        if (noRealityIdOrSameAsHeader(result) || (context.includeLinkedOper && result.realityId == operationalRealityId))
            return result;
    }
};

const initContextForRealities = async ({req}) => {
    return {
        realityId: req.headers[realityIdHeaderName] ? req.headers[realityIdHeaderName] : 0,
        includeLinkedOper: req.headers[includeLinkedOperHeaderName] == "false" ? false : req.headers[includeLinkedOperHeaderName]
    };
};

export {realitiesMiddleware, initContextForRealities};
