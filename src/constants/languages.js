export const languages = [
  {
    language: "C",
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
  {
    language: "C++",
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
  {
    language: "Python",
    code: `
        def main():
            // write your code here
            print("Heelo, World!")
        if __name__ == "__main__":
            main()
    `,
    file: "main.py",
  },
  {
    language: "Java",
    code: `
        public class Heelo{
            public static void main(String[] args){
                // write your code here
                System.out.println("Heelo, World!");
            }
        }
    `,
    file: "Main.java",
  },
  {
    language: "JavaScript",
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
  {
    language: "TypeScript",
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
  {
    language: "Rust",
    code: `
        fn main(){
            println!("Heelo, World!");
        }
    `,
    file: "main.rs",
  },
];
// 'JavaScript',
// "Python",
// "Java",
// "Php",
// "C",
// "C++",
// "TypeScript"
