import { CountryIsoCodes, UkCounties } from '../utils/location';
import { Model } from '../utils/api';
type _UserTeacher<T extends Teacher> = Omit<T, "user">;
type _UserStudent<S extends Student> = Omit<S, "user" | "auto_gen_password">;
export type User = Model<number, {
    password: string;
    last_login?: Date;
    first_name: string;
    last_name?: string;
    email?: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    requesting_to_join_class?: Class["id"] | null;
    teacher?: _UserTeacher<Teacher>;
    student?: _UserStudent<Student>;
}>;
export type TeacherUser<Fields = User> = Fields & {
    email: string;
    last_name: string;
    teacher: _UserTeacher<Teacher>;
    student?: undefined;
};
export type SchoolTeacherUser<Fields = User> = TeacherUser<Fields> & {
    teacher: _UserTeacher<SchoolTeacher>;
};
export type AdminSchoolTeacherUser<Fields = User> = SchoolTeacherUser<Fields> & {
    teacher: _UserTeacher<AdminSchoolTeacher>;
};
export type NonAdminSchoolTeacherUser<Fields = User> = SchoolTeacherUser<Fields> & {
    teacher: _UserTeacher<NonAdminSchoolTeacher>;
};
export type NonSchoolTeacherUser<Fields = User> = TeacherUser<Fields> & {
    teacher: _UserTeacher<NonSchoolTeacher>;
};
export type StudentUser<Fields = User> = Fields & {
    email?: undefined;
    last_name?: undefined;
    teacher?: undefined;
    student: _UserStudent<Student>;
};
export type IndependentUser<Fields = User> = Fields & {
    email: string;
    last_name: string;
    teacher?: undefined;
    student?: undefined;
};
export type Teacher = Model<number, {
    user: User["id"];
    school?: School["id"];
    is_admin: boolean;
}>;
export type SchoolTeacher<Fields = Teacher> = Fields & {
    school: School["id"];
};
export type AdminSchoolTeacher<Fields = Teacher> = SchoolTeacher<Fields> & {
    is_admin: true;
};
export type NonAdminSchoolTeacher<Fields = Teacher> = SchoolTeacher<Fields> & {
    is_admin: false;
};
export type NonSchoolTeacher<Fields = Teacher> = Fields & {
    school?: undefined;
    is_admin: false;
};
export type Student = Model<number, {
    user: User["id"];
    school: School["id"];
    klass: Class["id"];
    auto_gen_password: string;
}>;
export type School = Model<number, {
    name: string;
    country?: CountryIsoCodes;
    uk_county?: UkCounties;
}>;
export type Class = Model<string, {
    name: string;
    teacher: Teacher["id"];
    school: School["id"];
    read_classmates_data: boolean;
    receive_requests_until?: Date;
}>;
export type AuthFactor = Model<number, {
    user: User["id"];
    type: "otp";
}>;
export type OtpBypassToken = Model<number, {
    user: User["id"];
    token: string;
}>;
export {};
