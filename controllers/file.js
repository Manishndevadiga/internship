const path = require('path');
const fs = require('fs');


module.exports = {
    fileWrite: (req, res) => {
        res.render('CommentBox', {
          errorMessage: 0
        })
       },

       fileWritePost: (req, res) => {
        let data = req.body;
        console.log(data);
        // res.send('File Upload');
        fs.appendFile('./CommentFiles.txt', `${JSON.stringify(data)}\n`, (err) => {
            if (err) {
                console.error('Error appending to file:', err);
                res.status(500).send('Error appending to file');
                return;
            }
            console.log('Data appended to file successfully');
            res.send('Data appended to file successfully');
        });     
         // res.send('File Upload');
    },

    fileReadStd: (req, res) => {
        fs.readFile('./CommentFiles.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).send('Error reading file');
                return;
            }
            console.log('File content:', data);
            
            // Split the file content into lines
            const lines = data.trim().split('\n');     
    
            // Parse each non-empty line as JSON and collect into an array
            const jsonData = lines
                .filter(line => line.trim() !== '') // Filter out empty lines
                .map(line => JSON.parse(line));      // Parse each non-empty line as JSON
            
            // Send the parsed JSON data as the response
            res.render('std_comment', { data: jsonData });     
    });
  
},


    fileRead: (req, res) => {
        fs.readFile('./CommentFiles.txt', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                res.status(500).send('Error reading file');
                return;
            }
            console.log('File content:', data);
            
            // Split the file content into lines
            const lines = data.trim().split('\n');     
    
            // Parse each non-empty line as JSON and collect into an array
            const jsonData = lines
                .filter(line => line.trim() !== '') // Filter out empty lines
                .map(line => JSON.parse(line));      // Parse each non-empty line as JSON
            
            // Send the parsed JSON data as the response
            res.render('DisplayComment', { data: jsonData });
        });
},


DeleteComment: async function (req, res) {

    function deleteCommentByContent(filename, commentToDelete) {
        // Read the content of the file
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
    
            // Split the content into comments
            let comments = data.split('\n');
    
            // Find and remove the comment matching the content
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].includes(commentToDelete)) {
                    comments.splice(i, 1); // Remove the comment
                    break; // Stop searching after finding and removing the comment
                }
            }
    
            // Join the remaining comments to form the modified content
            let modifiedContent = comments.join('\n');
    
            // Write the modified content back to the file
            fs.writeFile(filename, modifiedContent, 'utf8', (err) => {
                if (err) {
                    console.error("Error writing to file:", err);
                    return;
                }
                console.log("Comment deleted successfully.");
            });
        });
    }
    
    // Specify the file name
    const filename = "CommentFiles.txt";
    
console.log(req.body.comment);

const commentToDeleteis = req.body.comment;
    // Specify the comment content to delete
    const commentToDelete = commentToDeleteis; 
    
    // Call the function to delete the comment by content
    deleteCommentByContent(filename, commentToDelete);
  }

}
