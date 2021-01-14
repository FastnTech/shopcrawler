import {Category,CategoryServiceFactory,CategoryConfiguration,LogLevel} from "typescript-logging";

CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));

export const catDatabaseService = new Category("database_service");
export const catProductProd = new Category("product", catDatabaseService);