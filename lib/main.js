"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const ref = github.context.ref;
            const tagPath = "refs/tags/";
            if (ref && ref.startsWith(tagPath)) {
                var tag = ref.substr(tagPath.length, ref.length);
                const regexStr = core.getInput("tagRegex");
                if (regexStr) {
                    const regex = new RegExp(regexStr);
                    const groupIdx = parseInt(core.getInput("tagRegexGroup") || "1");
                    const result = regex.exec(tag);
                    if (result && result.length > groupIdx) {
                        tag = result[groupIdx];
                    }
                    else {
                        core.warning(`Failed to match regex '${regexStr}' in tag string '${tag}'. Result is '${result}'`);
                        return;
                    }
                    // Return named groups on output
                    if (result.groups) {
                        for (const [key, value] of Object.entries(result.groups)) {
                            core.setOutput(key, value);
                        }
                    }
                }
                core.exportVariable("GIT_TAG_NAME", tag);
                core.setOutput('tag', tag);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
