const db = require('../db_config/db_config.js');

const createDataFile = (req, res) => {   
    const { name, hex_code} = req.body;
    const query = 'INSERT INTO users (name, hex_code) VALUES (?, ?)';

    // Check for nesesery fields

    if (!(name && hex_code)) {
        const message = 'name, hex_code';
        console.log(message);
        return res
            .status(404)
            .json({message});
    }

    // Check for dublicated names

    db.query('SELECT COUNT(*) AS namesCount FROM users WHERE name=?', [name], (err, result) => {
        const count = result[0].namesCount;
        if(count !== 0) {
            const message = `Data file with name:[${name}] is already existing`;
            console.log(message);
            return res
                .status(404)
                .json({message});
        }

        // Create data file
        db.query(query, [name, hex_code], (err, result) => {
            if(!err){
                const message = `Data file with name:[${name}] was added`;
                console.log(message);
                return res
                    .status(200)
                    .json({message});
            } else {
                return res
                    .status(500)
                    .json(err);
            }
        });
    });

};

const getDataFiles = (req, res) => {

    // Get data files

    const query = 'SELECT *FROM users';
    db.query(query, (err,result) => {
        if(!err){
            const message = 'Data files were succsesfuly received';
            console.log(message);
            return res
                .status(200)
                .json({message, result});
        } else {
            return res
                .status(500)
                .json(err);
        }
    });
};

const getDataFile = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT *FROM users WHERE id=?';

    // Get data file

    db.query(query, [id], (err,result) => {
        // Check if data file exist
        if (result.length == 0) {
            const message = `No data file with id:[${id}]`;
            console.log(message);
            return res
                .status(404)
                .json({message});
        }
        if(!err){
            const message = `Data file with id:[${id}] was recieved`;
            console.log(message);
            return res
                .status(200)
                .json({message, result});
        } else {
            return res
                .status(500)
                .json(err);
        }
    });
};

const deleteDataFile = (req, res) => { 
    const id = req.params.id;
    const query = 'DELETE FROM users WHERE id=?';

    // Deleate data file

    db.query(query, [id], (err, result) => {
        // Check if data file exist
        if(result.affectedRows == 0) {
            const message = `No data file with id:[${id}]`;
            console.log(message);
            return res
                .status(404)
                .json({message});
        }
        if(!err){
            const message = `Data file with id:[${id}] was succsessfuly deleted`;
            console.log(message);
            return res
                .status(200)
                .json({message});
        } else {
            return res
                .status(500)
                .json(err);
        }
    });
};

const updateDataFile = (req,res) => {
    const id = req.params.id; 
    const { name, hex_code } = req.body;
    const query = 'UPDATE users SET name=?, hex_code=? where id=?';

    // Update data file

    db.query(query, [name, hex_code, id],(err, result) => {
        // Check if data file exist
        if(result.affectedRows == 0) {
            const message = `No data file with id:[${id}]`;
            return res
                .status(404)
                .json({message});
        }
        if (!err) {
            const message = `Data file with id:[${id}] succsessfuly updated`;
            console.log(message);
            return res
                .status(200)
                .json({message});
        } else {
            return res
                .status(500)
                .json(err);
        }
    });
};

module.exports = {createDataFile, getDataFiles, getDataFile, deleteDataFile, updateDataFile};