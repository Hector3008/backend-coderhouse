import { Command } from "commander";

const program = new Command()

  program.option('-port <port>', "puerto del servidor", null);
  program.option("-mode <mode>", "modo de ejecución", null);  
  program.option("-persistence <persistence>", "persistencia: mongo", null);

program.parse();

export default program

