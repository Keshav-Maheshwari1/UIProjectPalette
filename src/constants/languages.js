export const languages = [
  {
    language: "c",
    C: {
      code: `
          #include<stdio.h>
  
          int main(){
              // write your code here
              printf("Heelo, World!\n")
              return 0;
          }
      `,
      file: "main.c",
    },
  },
  {
    language: "cpp",
    "C++": {
      code: `
          #include <iostream>
          using namespace std;

          int main(){
              // write your code here
              cout<< "Heelo, World!"<<endl;
          }
      `,
      file: "main.cpp",
    },
  },
  {
    language: "python",
    Python: {
      code: `
          def main():
              // write your code here
              print("Heelo, World!")
          if __name__ == "__main__":
              main()
      `,
      file: "main.py",
    },
  },
  {
    language: "java",
    Java: {
      code: `
        public class Main{
            public static void main(String[] args){
                  // write your code here
                  System.out.println("Heelo, World!");
                  }
                  }
                  `,
      file: "Main.java",
    },
  },
  {
    language: "javascript",
    JavaScript: {
      code: `
        (function(){
            function main(){
                // write your code here
                console.log("Heelo, World!");
                }
                main();
                })();
                `,
      file: "main.js",
    },
  },
  {
    language: "typescript",
    TypeScript: {
      code: `
        (function(){
            function main(): void {
                // write your code here
                console.log("Heelo, World!");
                }
                main();
                })();
                `,
      file: "main.ts",
    },
  },
  {
    language: "rust",
    Rust: {
      code: `
        fn main(){
            println!("Heelo, World!");
            }
            `,
      file: "main.rs",
    },
  },
];
// 'JavaScript',
// "Python",
// "Java",
// "Php",
// "C",
// "C++",
// "TypeScript"

export const codeSnippets = {
  c: {
    code: `
   #include<stdio.h>
  
    int main(){
        // write your code here
          printf("Heelo, World!")
          return 0;
      }
    `,
    file: "main.c",
  },
  "cpp": {
    code: `
    #include <iostream>
    using namespace std;

    int main(){
        // write your code here
        cout<< "Heelo, World!"<<endl;
      }
    `,
    file: "main.cpp",
  },
  python: {
    code: `
    def main():
        // write your code here
        print("Heelo, World!")
        if __name__ == "__main__":
            main()
    `,
    file: "main.py",
  },
  java: {
    code: `
    public class Main{
      public static void main(String[] args){
          // write your code here
          System.out.println("Heelo, World!");
        }
      }
                `,
    file: "Main.java",
  },
  typescript: {
    code: `
    (function(){
        function main(): void {
          // write your code here
          console.log("Heelo, World!");
        }
        main();
    })();
              `,
    file: "main.ts",
  },
  rust: {
    code: `
    fn main(){
      println!("Heelo, World!");
    }
          `,
    file: "main.rs",
  },
  javascript: {
    code: `
    (function(){
        function main(){
          // write your code here
          console.log("Heelo, World!");
        }
        main();
    })();
              `,
    file: "main.js",
  },
};
