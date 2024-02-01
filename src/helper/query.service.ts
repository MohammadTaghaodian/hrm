import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';
import { FilterParamsDto } from 'src/public/dto/get-by-filter.dto';
import { Repository } from 'typeorm';

@Injectable()
export class QueryService {
  createFilterQuery(repository: Repository<any>, filter: FilterParamsDto, table_name: string, condition: any = null, wheres: any = null) {
    const queryBuilder = repository.createQueryBuilder(table_name);
    let   orderType = "DESC"

    if (condition) {
      queryBuilder.orWhere(table_name + '.user_id = '+ condition);
    }

    if(wheres) queryBuilder.orWhere(wheres);

    if( filter['fields']) filter['fields'].forEach(element => {
      if(isArray(element['value']))
      {
        element['value'].forEach(item => {
          queryBuilder.orWhere(table_name+'.'+element['key']+' '+element['condition']+"'"+item+"'");
        });
      } 
      else if(isArray(element['key']))
      {
          element['key'].forEach(item => {
          queryBuilder.orWhere(table_name+'.'+item+' '+element['condition']+"'"+element['value']+"'");
        });
      } else queryBuilder.andWhere(table_name+'.'+element['key']+' '+element['condition']+"'"+element['value']+"'");
    });

    // افزودن مرتب‌سازی بر اساس createdAt به صورت نزولی (DESC)
    if(filter['sort_field']){
      if(filter['sort_type']){
        orderType = filter['sort_type']
        orderType == "DESC" ? queryBuilder.orderBy(table_name + '.'+filter['sort_field'], 'DESC'): queryBuilder.orderBy(table_name + '.'+filter['sort_field'], 'ASC')
      } queryBuilder.orderBy(table_name + '.'+filter['sort_field'], 'DESC');
  }else queryBuilder.orderBy(table_name + '.createdAt', 'DESC');

    queryBuilder.skip((filter.pageNumber - 1) * filter.pageSize);
    queryBuilder.take(filter.pageSize);
    // console.log(queryBuilder.getQueryAndParameters())
    return queryBuilder;
  }
}