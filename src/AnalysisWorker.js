/* eslint-disable import/no-webpack-loader-syntax */
import Worker from "worker-loader!./worker.js";
import { wrap } from "comlink";

// instantiate worker for analysis
const worker = wrap(new Worker());
export default worker;
