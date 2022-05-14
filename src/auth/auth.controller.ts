import { Body, Controller, Param, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthDto } from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private userService: AuthService) {}

    @Post("signup")
    async signUp(@Body() dto: AuthDto): Promise<string> {
        return this.userService.signUp(dto);
    }

    @UseGuards(LocalAuthGuard)
    @Post("signin")
    async signIn(@Request() req) { 
        return this.userService.signIn(req.user);
    }

    @Post("signinwithgoogle/:idToken")
    async signInWithGoogle(@Param() param: any) {
        return this.userService.signInWithGoogle(param.idToken);
    }
}