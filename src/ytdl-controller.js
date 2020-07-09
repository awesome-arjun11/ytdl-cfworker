import { getBasicInfo, getFullInfo, validateID} from '../ytdl-stripped/main';
import { theResponse, badRequestResponse, serverErrorResponse } from './http-responses'


const getytinfo = async (infofn, id) => {
    if (!validateID(id))
        return badRequestResponse("Invalid ID");

    try{
    const info = await infofn(id);
    console.log(info);
    return theResponse(
        200,
        'OK',
        {},
        JSON.stringify(info)
    );
    }catch(err){
        console.log(err.stack);
        return serverErrorResponse(err);
    };
}

export const handlerInfo = async (request, { id } ) => {
    return getytinfo(getBasicInfo, id);
}

export const handlerFullInfo = async (request, { id }) => {
    return getytinfo(getFullInfo, id);
}


export const handlerPatchedInfo = async (request, params) => {
    if (!validateID(params.id))
        return badRequestResponse("Invalid ID");
    getBasicInfo(params.id).then(info => {
        return theResponse(
            200,
            'OK',
            {},
            JSON.stringify(info)
        )
    });
}

