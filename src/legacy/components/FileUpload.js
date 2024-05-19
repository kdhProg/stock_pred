
function FileUpload(){
    return(
        <div>
            <form method="post" action="/upload" encType="multipart/form-data">
                <input type="file" name="file" />
                <input type="submit" value="submit"/>
            </form>
        </div>
    );
}

export default FileUpload;