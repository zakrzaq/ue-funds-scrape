import { scheduleJob } from "node-schedule";
import { UeFundsTask } from "./ue-funds";
import { sp24Task } from "./sp24";
import logger from "./services/logger";

require("dotenv").config();

const tasks = [
  {
    id: 1,
    name: "EU Funds Slaskie",
    runtimes: ["09:00", "16:00", "21:30"],
    controller: UeFundsTask,
  },
  {
    id: 2,
    name: "SP24 Halemba News",
    runtimes: ["07:00", "15:00", "21:30"],
    controller: sp24Task,
  },
];

const runTask = async (task: {
  id: number;
  name: string;
  runtimes: string[];
  controller: () => Promise<void>;
}) => {
  logger.info(`Running task: ${task.name}`);
  await task.controller();
};

const scheduleTasks = () => {
  tasks.forEach((task) => {
    runTask(task);
    logger.info(
      `Scheduled task '${task.name}' for ${task.runtimes.join(", ")}`,
    );

    task.runtimes.forEach((runtime) => {
      const [hour, minute] = runtime.split(":").map(Number);
      const cronExpression = `${minute} ${hour} * * *`;

      scheduleJob(cronExpression, () => {
        runTask(task);
      });
    });
  });
};

scheduleTasks();
