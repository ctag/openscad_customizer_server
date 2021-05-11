var express = require('express');
var router = express.Router();
const { exec } = require("child_process");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function gen_stl(req) {
  const timestamp = Date.now();
  console.log("Time: ", timestamp);
  const arg_part = ` -D part=\\"${req.body.part}\\"`
  const arg_height = ` -D box_height=${req.body.height}`
  const arg_width = ` -D box_width=${req.body.width}`
  const arg_depth = ` -D box_depth=${req.body.depth}`
  const arg_seal_h = ` -D seal_height=${req.body.seal_height}`
  const arg_latch_num = ` -D latch_num=${req.body.latch_num}`
  const arg_seal = ` -D seal_type=\\"${req.body.seal_type}\\"`
  const output = `public/meshes/${timestamp}_${req.body.part}.stl`;
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

router.post('/stl', async function(req, res, next) {
  const path = await gen_stl(req);
  res.download(path);
});

module.exports = router;
