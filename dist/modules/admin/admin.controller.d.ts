import { AdminService } from './admin.service';
import * as dto from './admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    phoneAuth_Confirm(requestData: dto.createAccountDto, req: any, res: any): Promise<any>;
    loginFirst(requestData: dto.loginFirstDto, req: any, res: any): Promise<any>;
    loginSecond(requestData: dto.loginSecondDto, req: any, res: any): Promise<any>;
    signout(req: any, res: any): Promise<any>;
    getAdminList(req: any, res: any): Promise<any>;
    getTranslatorList(requestData: dto.getTranslatorListDto, req: any, res: any): Promise<any>;
}
