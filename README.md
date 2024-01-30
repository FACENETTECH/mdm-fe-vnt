# ProjectBase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# các version:

node: 16 (hoặc 18)
angular: 15

# lệnh cài đặt node_modules:

npm install --force

# phân quyền chặn routing

Ví dụ:
canActivate: [AuthGuard],
data: { requiredRole: ['admin_business', 'user_business'] }

requiredRole là những role được cho phép truy cập vào routing đó

# thay đổi theme: nằm trong themeService

cấu trúc tên file theme: theme\_{tên file theme}.css
để đổi màu của cái nào theo theme thì thêm class vào trong file theme và thêm class đó vào vị trí cần đổi màu theme

## Note

    Phần phân role đang hơi nhiều và bị lặp lại khá rối. Có thể điều chỉnh lại các role cho ngắn gọn. Ví dụ chỉ có admin_business mới được phép cấu hình thì không cần quyền mdm_config-manage nữa.
