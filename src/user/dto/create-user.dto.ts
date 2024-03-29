import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive, IsString, IsBoolean, IsDateString, IsEnum, IsOptional } from "class-validator";
import UserType from "../enum/UserTypeEnum";

export class CreateUserDto {
    @ApiProperty({
        description: 'نوع کاربر',
        enum: UserType,
        default: UserType.EMPLOYEES, // یک مقدار پیشفرض می‌توانید تعیین کنید
        required: true,
    })
    @IsEnum(UserType, { message: 'نوع کاربر نامعتبر است' })
    type: UserType;

    @ApiProperty({ example: 12345 })
    @IsOptional()
    device_id: string

    @ApiProperty({ example: "12345" })
    @IsPositive({ message: 'کد پرسنلی باید مقدار مثبت داشته باشد' })
    @IsOptional()
    personnel_code: string

    @ApiProperty({ example: '09123456789' })
    @IsString({ message: 'موبایل باید یک رشته باشد' })
    @IsOptional()
    mobile: string

    @ApiProperty({ example: '03155801512' })
    @IsString({ message: 'تلفن باید یک رشته باشد' })
    @IsOptional()
    telephone_number: string

    @ApiProperty({ example: 'John' })
    @IsString({ message: 'نام باید یک رشته باشد' })
    @IsOptional()
    first_name: string

    @ApiProperty({ example: 'Doe' })
    @IsString({ message: 'نام خانوادگی باید یک رشته باشد' })
    @IsOptional()
    last_name: string

    @ApiProperty({ example: 'Mike' })
    @IsString({ message: 'نام پدر باید یک رشته باشد' })
    @IsOptional()
    father_name: string

    @ApiProperty({ example: 'اصفهان' })
    @IsString({ message: 'استان باید یک رشته باشد' })
    @IsOptional()
    province: string

    @ApiProperty({ example: 'کاشان' })
    @IsString({ message: 'شهر باید یک رشته باشد' })
    @IsOptional()
    city: string

    @ApiProperty({ example: 'آدرس' })
    @IsString({ message: 'آدرس باید یک رشته باشد' })
    @IsOptional()
    address: string

    @ApiProperty({ example: 'رزومه' })
    @IsString({ message: 'رزومه باید یک رشته باشد' })
    @IsOptional()
    resume: string
    
    @ApiProperty({ example: 'رشته تحصیلی' })
    @IsString({ message: 'رشته تحصیلی باید یک رشته باشد' })
    @IsOptional()
    fields: string
    
    @ApiProperty({ example: 'مقطع' })
    @IsString({ message: 'مقطع باید یک رشته باشد' })
    @IsOptional()
    grade: string

    @ApiProperty({ example: '1234567890' })
    @IsString({ message: 'کد ملی باید یک رشته باشد' })
    @IsOptional()
    mellii_code: string

    @ApiProperty({ example: '1238' })
    @IsString({ message: 'شماره شناسنامه باید یک رشته باشد' })
    @IsOptional()
    sh_code: string

    @ApiProperty({ example: '1383/8/27' })
    @IsOptional()
    birthday_date: string

    @ApiProperty({ example: true })
    @IsBoolean({ message: 'وضعیت تاهل باید یک مقدار boolean باشد' })
    @IsOptional()
    married: boolean

    // @ApiProperty({ example: 1 })
    // @IsNumber({}, { message: 'نوع همکاری باید یک عدد صحیح باشد' })
    // @IsPositive({ message: 'نوع همکاری باید مقدار مثبت داشته باشد' })
    // assist_type: number

    // @ApiProperty({ example: 1 })
    // @IsNumber({}, { message: 'نوع عضویت باید یک عدد صحیح باشد' })
    // @IsPositive({ message: 'نوع عضویت باید مقدار مثبت داشته باشد' })
    // membership_type: number
}
