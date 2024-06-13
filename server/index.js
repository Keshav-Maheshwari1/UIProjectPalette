import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import childProcess from "child_process";
import readline from "readline";
import { openStdin, stdin } from "process";

const app = express();
app.use(cors());
app.use(express.json());

const port = 9090;

// const saveFile = (name, data) => {
//   return new Promise((resolve, reject) => {
//     fs.writeFile(name, data, function (err) {
//       if (err) {
//         console.log(err);
//         reject();
//       } else {
//         console.log("The file was saved!");
//         resolve();
//       }
//     });
//   });
// };

// const cExecute = (data, input) => {
//   return new Promise((resolve, reject) => {
//     const fileName = "test.c";
//     saveFile(fileName, data)
//       .then(() => {
//         // Create Input file
//         fs.writeFile("input.txt", input, function (err) {
//           if (err) {
//             console.log(err);
//             reject();
//           }
//         });
//         const filePath = path.join(__dirname, "../test.c");
//         exec("gcc " + filePath, (err, stdout, stderr) => {
//           if (err) {
//             // IF COMPILATION ERROR
//             console.error(`exec error: ${err}`);
//             resolve({
//               err: true,
//               output: err,
//               error: stderr,
//             });
//           }

//           // SUCCESSFULL COMPILATION EXECUTING
//           console.log("SUCCESSFULLY COMPILED");
//           exec("a.exe < " + "input.txt", (err, stdout, stderr) => {
//             if (err) {
//               console.log("ERROR " + err);
//               resolve({
//                 err: true,
//                 output: err,
//                 error: stderr,
//               });
//             }

//             console.log("OUTPUT ", stdout);
//             resolve({
//               err: false,
//               output: stdout,
//             });
//           });
//         });
//       })
//       .catch((error) => {
//         console.log("ERROR SAVE FILE" + error);
//         const err = {
//           err: true,
//           output: "Internal Server Error!",
//         };
//         resolve(err);
//       });
//   });
// };

// const javaCode = `
// public class Main {
//   public static void main(String[] args) {
//     System.out.println("Hello, World!");
//   }
// }
// `;

const rl = readline.createInterface({
  input: process.stdin,
  terminal: true,
});


const pCode = `
print("hello world")
a=0
a+=int(input("input a number"))
a+=int(input("enter a number"))

print("value of a = ", a)`;

const pythonProcess = childProcess.spawn(`python`, [`-c`, pCode]);

pythonProcess.stderr.on("data", (data) => {
  console.log(data?.toString());
});
pythonProcess.stdout.on('data', (data) => {
  process.stdout.write(data.toString());
  // Check if the data contains the input prompt
  if (pCode.includes("input")) {

    rl.question('', (answer) => {
      pythonProcess.stdin.write(answer + '\n');
    });
  }
});


pythonProcess.on("close", (code) => {
  console.log(code);
});

// const cCode = `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`;
// console.log();

app.get("/", (req, res) => {
  res.status(200).send("hello");
});

// const pProcess = childProcess.spawn(`python`, ['python.py']);

// pProcess.stdout.on('error', (data)=> {
//   console.log(data.toString());
// })

// pProcess.stdout.on('data', (data)=> {
//   console.log(data.toString());
//   if(data.toString().includes("enter")) {
//     rl.question('', (answer)=> {
//       pProcess.stdin.write(`${answer}`);
//     })
//     pProcess.stdin.end();
//   }
// })

// pProcess.on('close', (code)=> {
//   console.log(code)
// })

app.post("/code/submit", (req, res) => {
  const { code, input } = req.body;
  console.log(code)

  const pythonProcess = childProcess.spawn(`python`, ['-c', code]);
  let dataToSend;

  pythonProcess.stderr.on('data', (data)=> {
    res.json({rst: data.toString(), isStop: false})
  })
    pythonProcess.stdout.on("data", (data) => {
      pythonProcess.stdout.write(data.toString())
      console.log(data.toString());
      dataToSend = data.toString();
      console.log(input)
      if (code.includes("input")) {
        res.json({rst: dataToSend, isStop: true})
          rl.question('', (ans)=> {
            pythonProcess.stdin.write(input + '\n')
          })
      }
    });
  pythonProcess.on("close", (code) => {
    console.log(code);
  });
});

app.listen(port, () => {
  console.log("server is running on ", port);
});
