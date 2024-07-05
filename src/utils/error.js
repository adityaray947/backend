export const errorHandler=(statusCode,message="Failed")=>{
    const error=new Error()
    error.statusCode=statusCode;
    error.message=message
    return error;
};