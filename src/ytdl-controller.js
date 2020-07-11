import { getBasicInfo, getFullInfo, validateID} from '../ytdl-stripped/main';
import { theResponse, badRequestResponse, serverErrorResponse } from './http-responses'


const getytinfo = async (infofn, id) => {
    if (!validateID(id))
        return badRequestResponse(`Invalid ID : ${id}`);

    try {

        const info = await infofn(id);
        return theResponse(
            200,
            'OK',
            {'Cache-Control': 'max-age=300'},
            JSON.stringify(info)
        );

    } catch(err) {

        if (err.name === 'YTDLError'){
            return theResponse(
                200,
                'OK',
                {},
                JSON.stringify({error: err.message})
            );
        }
        else {
            return serverErrorResponse(err);
        } 
    };
}

export const handlerInfo = async (request, { id } ) => {
    return getytinfo(getBasicInfo, id);
}

export const handlerFullInfo = async (request, { id }) => {
    return getytinfo(getFullInfo, id);
}



