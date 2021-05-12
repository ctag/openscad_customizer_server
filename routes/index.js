var express = require('express');
var router = express.Router();
const { exec } = require("child_process");
const path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

function gen_stl(req) {
  //console.log(req.query);
  const timestamp = Date.now();
  //console.log("Time: ", timestamp);
  const arg_part = ` -D part=\\"${req.query.part}\\"`
  const arg_height = ` -D box_height=${req.query.height}`
  const arg_width = ` -D box_width=${req.query.width}`
  const arg_depth = ` -D box_depth=${req.query.depth}`
  const arg_seal_h = ` -D seal_height=${req.query.seal_height}`
  const arg_latch_num = ` -D latch_num=${req.query.latch_num}`
  const arg_seal = ` -D seal_type=\\"${req.query.seal_type}\\"`
  const output = `public/meshes/${timestamp}_${req.query.part}.stl`;
  const baseCmd = `openscad -q -o ${output} penguin_case/penguin_case.scad`;
  return new Promise((resolve, reject) => {
    exec(baseCmd + arg_part + arg_height + arg_width + arg_depth + arg_seal_h + arg_latch_num + arg_seal,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          reject();
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          reject();
        }
        console.log(`stdout: ${stdout}`);
        resolve(output);
    })
  })
}

router.get('/stl', async function(req, res, next) {
  const path = await gen_stl(req);
  res.download(path);
});

module.exports = router;
