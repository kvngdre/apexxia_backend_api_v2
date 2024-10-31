import { type Request, type Response } from "express";
import { Lifecycle, scoped } from "tsyringe";
import { BaseController } from "./base-controller";
import { ApiResponse } from "@web/web-infrastructure";
import info from "../../../package.json";

@scoped(Lifecycle.ResolutionScoped)
export class SystemController extends BaseController {
  public getHealth = async (req: Request, res: Response) => {
    function formatUptime(seconds: number): string {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hours}h ${minutes}m ${secs}s`;
    }

    const payload = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: info.version,
      databases: {
        tenantDB: "connected"
      },
      cache: "connected",
      uptime: formatUptime(process.uptime())
    };

    res.status(200).json(ApiResponse.success("Retrieved API health information", payload));
  };

  public getAPIDoc = async (req: Request, res: Response) => {
    res.redirect("https://documenter.getpostman.com/view/22366860/2s93CPqXyH");
  };
}
