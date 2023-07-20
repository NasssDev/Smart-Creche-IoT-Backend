import client from "../../utils/mqtt";

class SiesteModeHelper { 
    public onMode(): boolean { 
        return true
    }
    public offMode(): boolean { 
        return true
    }
}
export default new SiesteModeHelper();