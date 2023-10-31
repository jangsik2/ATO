import { AtoService } from './ato.service';
export declare class AtoController {
    private readonly atoService;
    constructor(atoService: AtoService);
    wordstatus(req: any, res: any): Promise<any>;
    atoPost(requestData: any, req: any, res: any): Promise<any>;
    translateName(req: any, res: any): Promise<any>;
    test(req: any, res: any): Promise<any>;
}
