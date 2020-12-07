[1mdiff --git a/src/app/meeting/master-settings/acl/permission/services/permission.service.ts b/src/app/meeting/master-settings/acl/permission/services/permission.service.ts[m
[1mindex 1d77c8f..452815e 100644[m
[1m--- a/src/app/meeting/master-settings/acl/permission/services/permission.service.ts[m
[1m+++ b/src/app/meeting/master-settings/acl/permission/services/permission.service.ts[m
[36m@@ -20,10 +20,10 @@[m [mexport class PermissionService extends MasterService<Permission> {[m
                         public authenticationService: AuthenticationService) {[m
     super(http, MasterService.memServiceMasterSettings, PermissionService.REQUEST_PATH);[m
   }[m
[31m-[m
[31m-  getUrl(): string {[m
[31m-    return 'http://localhost' + MasterService.memServiceMasterSettings + PermissionService.REQUEST_PATH + '/';[m
[31m-  }[m
[32m+[m[32m  //[m
[32m+[m[32m  // getUrl(): string {[m
[32m+[m[32m  //   return 'http://localhost' + MasterService.memServiceMasterSettings + PermissionService.REQUEST_PATH + '/';[m
[32m+[m[32m  // }[m
 [m
   isValid(dto: Permission[]): boolean {[m
     return false;[m
