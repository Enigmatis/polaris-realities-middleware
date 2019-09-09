import {IMiddleware} from "graphql-middleware";

const realityIdHeaderName: string = "reality-id";
const includeLinkedOperHeaderName: string = "include-linked-oper";

const realitiesMiddleware: IMiddleware = async (resolve: any, root: any, args: any, context: any, info: any) => {
    const result = await resolve(root, args, context, info);
    const operationalRealityId: number = 0;
    const realityIdHeaderExists: any = context.realityId === 0 ? true : context.realityId;
    const isSubEntity: boolean = true;
    if (!root) { // assert that its a root resolver
        // if (!context.realityId ||
        if (result instanceof Array && realityIdHeaderExists) {
            return result.filter(entity => entity.realityId === context.realityId ||
                context.includeLinkedOper === true && entity.realityId === operationalRealityId);
        } else {
            return result;
        }
    } else {
        return result;
    }
};

const initContextForRealities = async ({req}) => {
    return {
        realityId: req.headers[realityIdHeaderName],
        includeLinkedOper: req.headers[includeLinkedOperHeaderName]
    };
};

export {realitiesMiddleware, initContextForRealities};
