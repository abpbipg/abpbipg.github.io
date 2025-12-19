# 数据库与表创建相关SQL

## 1. 创建数据库

功能：创建名为“职工社团_whl”的数据库，指定字符集为utf8，校验规则为utf8_general_ci

```Plain
create database `职工社团_whl` DEFAULT CHARACTER set utf8 COLLATE 'utf8_general_ci';
```

## 2. 创建数据表（含外键约束）

功能：创建“职工”“社会团体”“参加”三张表，并设置外键约束保证数据参照完整性

```Plain
-- 创建职工表
create table `职工` (
`职工号` char(3) primary key,
`姓名` varchar(10) not null,
`年龄` tinyint default 25,
`性别` char(1),
`籍贯` varchar(10)
);
-- 创建社会团体表
create table `社会团体` (
`编号` char(3) primary key,
`名称` varchar(20),
`负责人` char(3),
`活动地点` varchar(20),
FOREIGN KEY (负责人) REFERENCES 职工(职工号)
);
-- 创建参加表
create table `参加`(
`职工号` char(3),
`编号` char(3),
`参团日期` date,
primary key ( `职工号`, `编号`),
FOREIGN key (职工号) REFERENCES 职工(职工号),
FOREIGN key (编号) REFERENCES 社会团体(编号)
);
```

# 二、数据插入相关SQL

功能：向三张数据表中批量插入实验指定数据

```Plain
-- 插入职工表数据
insert into `职工` (`职工号`,`姓名`,`年龄`,`性别`,`籍贯`) values 
( 'w01', '张国华', 50, '男', '湖北' ),
( 'w02', '赵子琪', 34, '女', '湖北' ),
( 'w03', '刘小霞', 24, '女', '湖南'),
( 'w04', '张涛', 29, '男', '河南'),
( 'w05', '高琪雅', 27, '女', '湖北'),
( 'w06', '王方', 34, '男', '河北'),
( 'w07', '刘长辉', 42, '男', '河南'),
( 'w08', '周密', 44, '女', '湖南');
-- 插入社会团体表数据
INSERT INTO `社会团体` (编号, 名称, 负责人, 活动地点) VALUES
('g01', '爱电影', 'w01', '3楼302'),
('g02', '篮球先锋', 'w03', '室内篮球场'),
('g03', '摄影家协会', 'w01', '4楼406'),
('g04', '美食家', 'w05', '3楼307'),
('g05', '游戏天地', 'w03', '4楼电竞室'),
('g06', '我爱乒乓', 'w07', '3楼303'),
('g07', '宠物世界', 'w01', '3楼309');
```

# 三、单表查询相关SQL

```Plain
-- 插入参加表数据
INSERT INTO `参加` (职工号, 编号, 参团日期) VALUES
('w01', 'g01', '2017/9/9'),
('w01', 'g03', '2018/1/4'),
('w01', 'g07', '2015/4/3'),
('w02', 'g01', '2019/5/6'),
('w02', 'g07', '2015/9/3'),
('w03', 'g04', '2016/5/4'),
('w03', 'g05', '2019/7/19'),
('w05', 'g04', '2017/10/19'),
('w06', 'g01', '2018/6/20'),
('w06', 'g04', '2018/6/21'),
('w06', 'g06', '2017/9/11'),
('w06', 'g07', '2016/2/20'),
('w07', 'g01', '2016/3/29'),
('w07', 'g06', '2014/11/13'),
('w07', 'g03', null);
-- 1. 查找“职工”表中所有职工的信息
select * from `职工`;

-- 2. 查找“社会团体”表中社团的编号和名称，输出时列名显示为“社团编号”和“社团名称”
select 编号 as 社团编号,名称 as 社团名称 from `社会团体`;

-- 3. 查找参加了社团的职工的职工号（去重）
select distinct 职工号 from `参加`;

-- 4. 将“职工”表中所有职工的年龄加一岁后输出
select 职工号,姓名,年龄+1 as 年龄,性别,籍贯 from `职工`;
```

## 1. 不带WHERE条件的查询

```Plain
-- 1. 查找“职工”表中男职工的职工号和性别
select 职工号,性别 from 职工 where `性别` = '男';

-- 2. 查找河南或河北籍的职工的职工号和年龄，结果按“年龄”降序排列
select 职工号,年龄 from 职工 where `籍贯` = '河南' or '河北' order by `年龄` desc;

-- 3. 查找“社会团体”表中活动地点在3楼的社团的编号和负责人，结果按“负责人”升序、“编号”降序排列
select 编号,负责人 from 社会团体 where `活动地点` like '3楼%' order by `负责人`,`编号` desc;

-- 4. 查找姓刘的职工的职工号和姓名
select 职工号,姓名 from 职工 where `姓名` like '刘%';

-- 5. 查找参团日期在2017年1月1日到2019年1月1日的职工的参团信息
select 职工号,编号,参团日期 from 参加 where `参团日期` between '2017-01-01' and '2019-01-01';

-- 6. 查找参加了“g01”社团且参团日期在2018年1月1日以前的职工的职工号
select 职工号 from 参加 where 参团日期 < '2018-01-01' and 编号 = 'g01';

-- 7. 查找男职工的平均年龄，为输出的集函数取别名
select avg(年龄) as 男职工平均年龄 from 职工 where `性别` = '男';

-- 8. 查找参团日期不详的职工的参团信息
select 职工号,编号 from 参加 WHERE 参团日期 IS NULL;
```

## 2. 带WHERE条件的查询

```Plain
-- 1. 查找男职工的参团信息，要求输出职工号、编号和参团日期
select 职工.职工号,编号,参团日期 
from 职工 join 参加 on 职工.`职工号`=参加.`职工号` 
where `性别` = '男';

-- 2. 查找所有社团的编号、负责人的职工号和姓名
select 社会团体.编号,职工号,姓名 
from 职工 join 社会团体 on  职工.`职工号`=社会团体.`负责人`;

-- 3. 查找职工“张国华”加入的社团的编号和名称
select 社会团体.编号,社会团体.名称 from 职工
join 参加 on 职工.职工号 = 参加.职工号
join 社会团体 on 参加.编号 = 社会团体.编号
where 职工.姓名 = '张国华';

-- 4. 查找加入了“爱电影”或“摄影家协会”社团的职工的姓名和年龄，结果按“年龄”降序和“职工号”升序排列
select 职工.姓名,职工.年龄 from 社会团体
join 参加 on 社会团体.编号 = 参加.编号
join 职工 on 职工.职工号 = 参加.职工号
where 社会团体.名称 = '爱电影' or '摄影家协会'
order by `年龄` desc, 职工.`职工号` asc;

-- 5. 查找所有社团的基本信息和加入了这些社团的参团信息，要求输出表中所有字段
select 社会团体.*,参加.* from 参加
     join 职工 on 职工.职工号 = 参加.职工号
     join 社会团体 on 社会团体.编号 = 参加.编号;

-- 6. 查找籍贯是“湖北”的负责人的姓名
select 职工.姓名 from 社会团体
join 职工 on 社会团体.负责人 = 职工.职工号
where 职工.`籍贯` = '湖北';

-- 7. 查找“张国华”任负责人的社团的编号和活动地点，结果按“编号”升序排列
select 社会团体.编号,社会团体.活动地点 from 职工
join 社会团体 on 社会团体.`负责人` = 职工.`职工号`
where 职工.姓名 = '张国华';

-- 8. 查找既加入了“g01”也加入了“g03”社团的职工的职工号
select 职工号 from 参加
where 参加.`编号` = 'g01'
and 职工号 IN (select 职工号 from 参加 where 编号 = 'g03');

-- 9. 查找同时兼任“g01”和“g05”社团负责人的职工的职工号
select a.负责人 as 职工号 from 社会团体 a 
join 社会团体 b on a.负责人 = b.负责人
where a.编号 = 'g01' and b.编号 = 'g05';
```

# 四、多表连接查询相关SQL

## 1. 使用比较操作符的子查询

# 五、子查询相关SQL

## 2. 使用IN操作符的子查询

```Plain
-- 1. 查找“职工”表中年龄比“张涛”大的职工的职工号和年龄
select 职工号,年龄 from 职工
where 年龄>(select 年龄 from 职工 where 姓名 ='张涛');

-- 2. 查找参加了“爱电影”社团的职工的职工号
select 职工号 from 参加
where 编号 = (select 编号 from 社会团体 where 名称 = '爱电影');

-- 3. 查找没有参加“爱电影”社团的职工的职工号
select distinct 职工号 from 参加
where 编号 not in  (select 编号 from 社会团体 where 名称 = '爱电影');

-- 4. 查找在加入了“g01”社团的职工中参团时间早于“王方”的职工的职工号和参团日期
select 职工号,参团日期 from 参加
where 编号 = 'g01' and 参团日期 < (
select 参团日期 from 参加 where 职工号 = (
select 职工号 from 职工 where 姓名 = '王方' limit 1)limit 1);

-- 5. 查找和“摄影家协会”社团是同一个负责人的其他社团的编号
select 编号 from 社会团体
where 负责人 = (
select 负责人 from 社会团体 where 名称 = '摄影家协会' limit 1)
and 名称 != '摄影家协会';
```

## 3. 使用ANY或ALL操作符的子查询

```Plain
-- 1. 查找职工号为“w02”的职工加入的社团的编号和名称
select 编号, 名称 from 社会团体 
where 编号 in (
select 编号 from 参加 where 职工号 = 'w02');

-- 2. 查找没有加入“g01”社团的职工的职工号和姓名
select 职工号, 姓名 from 职工 
where 职工号 not in (
select 职工号 from 参加 where 编号 = 'g01');

-- 3. 查找没有加入任何社团的职工的姓名和籍贯
select 姓名, 籍贯 from 职工 
where 职工号 not in (
select distinct 职工号 from 参加);

-- 4. 查找社团成员全是男职工的社团的编号
select 编号 from 社会团体 
where 编号 not in (
select distinct a.编号 from 参加 a 
join 职工 e on a.职工号 = e.职工号 
where e.性别 = '女'); 
```

# 六、分组和函数查询相关SQL

```Plain
-- 1. 查找比“河南”籍职工的年龄都大的职工的职工号和年龄
select 职工号, 年龄 from 职工 
where 年龄 > all (
select 年龄 from 职工 where 籍贯 = '河南'); 

-- 2. 在“参加”表中查找最先加入“g01”社团的职工的职工号
select 职工号 from 参加 
where 编号 = 'g01' and 参团日期 = all (
select min(参团日期) from 参加 where 编号 = 'g01');
-- 1. 在“职工”表中按性别统计男女职工的平均年龄
select 性别, avg(年龄) as 平均年龄 from 职工 group by 性别;

-- 2. 在“职工”表中按籍贯统计职工人数
select 籍贯, count(*) as 职工人数 from 职工 group by 籍贯;

-- 3. 在“社会团体”表中统计每位职工负责的社团数
select 负责人, count(*) as 负责社团数 from 社会团体 group by 负责人;

-- 4. 统计每个社团的名称及该社团的加入人数
select s.名称, count(a.职工号) as 加入人数 from 社会团体 s
left join 参加 a on s.编号 = a.编号 
group by s.编号, s.名称;

-- 5. 在“参加”表中，统计每个社团的编号以及最先加入该社团的参团日期
select 编号, min(参团日期) as 最先加入日期 from 参加 group by 编号;
```

## 1. 不带HAVING子句的分组查询

```Plain
-- 1. 在“参加”表中统计加入了3个及以上社团的职工的职工号
select 职工号 from 参加 group by 职工号 having count(*) >= 3;

-- 2. 在“参加”表中统计加入人数超过3人的社团的名称及参加人数
select s.名称, count(a.职工号) as 参加人数 from 社会团体 s
join 参加 a on s.编号 = a.编号 
group by s.编号, s.名称 
having count(a.职工号) > 3;

-- 3. 在“职工”表中统计职工平均年龄在40岁以上的籍贯信息
select 籍贯 from 职工 group by 籍贯 having avg(年龄) > 40;

-- 4. 在“社会团体”表中统计兼任两个以上社团负责人的职工的姓名
select e.姓名 from 职工 e
join 社会团体 s on e.职工号 = s.负责人 
group by e.职工号, e.姓名 
having count(s.编号);
```

## 2. 带HAVING子句的分组查询

```Plain
-- 1. 查找“河南”籍的职工中年龄最大的职工的职工号和年龄
select 职工号, 年龄 from 职工 
where 籍贯 = '河南' and 年龄 = (
select max(年龄) from 职工 where 籍贯 = '河南');

-- 2. 在“参加”表中查找最先加入“g01”社团的职工的职工号
select 职工号 from 参加 
where 编号 = 'g01' and 参团日期 = (
select min(参团日期) from 参加 where 编号 = 'g01');

-- 3. 查找比女职工平均年龄小的男职工的职工号
select 职工号 from 职工 
where 性别 = '男' and 年龄 < (
select avg(年龄) from 职工 where 性别 = '女'); 
```

## 3. 使用集函数的子查询

## 1. 往表中添加数据

# 七、数据操纵（添加、修改、删除）相关SQL

## 2. 修改表中数据

```Plain
-- 1. 往“职工”表中添加一条完整记录：职工号“w09”，姓名“汪伟”，年龄“45”，性别“男”，籍贯“湖北”
insert into 职工 (职工号, 姓名, 年龄, 性别, 籍贯) 
values ('w09', '汪伟', 45, '男', '湖北');

-- 2. 往“职工”表中添加一条个人完整记录，职工号为学号后三位
insert into 职工 (职工号, 姓名, 年龄, 性别, 籍贯) 
values ('123', '张三', 22, '男', '北京');

-- 3. 往“社会团体”表中添加一条完整记录：编号“g08”，名称“趣味编程”，负责人“w01”，活动地点“5楼机房”
insert into 社会团体 (编号, 名称, 负责人, 活动地点) 
values ('g08', '趣味编程', 'w01', '5楼机房');

-- 4. 往“参加”表中添加一条不完整记录：职工号“w01”，编号“g04”
insert into 参加 (职工号, 编号)  values ('w01', 'g04');

-- 5. 往“社会团体”表中添加一条不完整记录：编号“g10”，名称“美术社”，活动地点“3楼305”
insert into 社会团体 (编号, 名称, 活动地点) 
values ('g10', '美术社', '3楼305');

-- 6. 往“参加”表中批量添加个人参加社团记录
insert into 参加 (职工号, 编号, 参团日期) 
values 
('w10', 'g01', '2025/1/1'),
('w10', 'g07', '2025/1/2');
```

## 3. 删除表中数据

```Plain
-- 1. 将“职工”表中男职工的年龄加一岁
update 职工 set 年龄 = 年龄 + 1 where 性别 = '男';

-- 2. 将“社会团体”表中原来由w03负责的社团的负责人改为w04
update 社会团体 set 负责人 = 'w04' where 负责人 = 'w03';

-- 3. 将g03社团的活动地点改到“4楼404”
update 社会团体 set 活动地点 = '4楼404' where 编号 = 'g03';

-- 4. 将职工“刘小霞”参加“美食家”社团的参团日期改为“2016-07-03”
update 参加 set 参团日期 = '2016-07-03' 
where 职工号 = (
select 职工号 from 职工 where 姓名 = '刘小霞') 
and 编号 = (
select 编号 from 社会团体 where 名称 = '美食家');

-- 5. 将职工“张国华”担任负责人的社团的参团日期推后两天
update 参加 set 参团日期 = date_add(参团日期, interval 2 day) 
where 编号 in (
select 编号 from 社会团体 where 负责人 = (
select 职工号 from 职工 where 姓名 = '张国华'));
```

# 八、视图相关SQL

```Plain
-- 1. 将“职工”表中职工号为“w04”的职工的记录删除（先删关联记录）
delete from 参加 where 职工号 = 'w04';
update 社会团体 set 负责人 = null where 负责人 = 'w04';
delete from 职工 where 职工号 = 'w04';

-- 2. 将“参加”表中“刘小霞”的参团记录删除
delete from 参加 where 职工号 = (
select 职工号 from 职工 where 姓名 = '刘小霞');

-- 3. 将“职工”表中“刘小霞”的记录删除（先删关联记录）
delete from 参加 where 职工号 = (
select 职工号 from 职工 where 姓名 = '刘小霞');

update 社会团体 set 负责人 = null where 负责人 = (
select 职工号 from 职工 where 姓名 = '刘小霞');

delete from 职工 where 姓名 = '刘小霞';

-- 4. 将“社会团体”表中没有职工加入的社团的信息删除
delete from 社会团体 where 编号 not in (
select distinct 编号 from 参加);
```

## 1. 创建视图

```Plain
-- 1. 创建湖北籍职工的视图“湖北籍职工”，包含“职工号”“姓名”“籍贯”“年龄”四列
create view 湖北籍职工 as
select 职工号, 姓名, 籍贯, 年龄 from 职工 
where 籍贯 = '湖北';

-- 2. 创建包含2018年以前参团记录的视图“历史参团记录”
create view 历史参团记录 as select 职工号, 编号, 参团日期 from 参加 
where 参团日期 < '2018-01-01';

-- 3. 创建“社团负责人”视图，包含“社团编号”“社团名称”“负责人姓名”三列
create view 社团负责人 as
select s.编号 as 社团编号, s.名称 as 社团名称, e.姓名 as 负责人姓名 from 社会团体 s
join 职工 e on s.负责人 = e.职工号;

-- 4. 创建统计职工参加社团情况的视图“职工参团情况统计”
create view 职工参团情况统计 as
select e.姓名, count(a.编号) as 参团数 from 职工 e
left join 参加 a on e.职工号 = a.职工号 
group by e.职工号, e.姓名;
-- 1. 对“湖北籍职工”视图更新，将职工号为“w01”的职工年龄加一岁
update 湖北籍职工 set 年龄 = 年龄 + 1 where 职工号 = 'w01';

-- 2. 对“湖北籍职工”视图更新，删除职工号为“w02”的职工记录（先删外键约束）
alter table 参加 drop foreign key 参加_ibfk_1;
delete from 湖北籍职工 where 职工号 = 'w02';
alter table 参加 add constraint 参加_ibfk_1 foreign key (职工号) references 职工(职工号);

-- 3. 对“历史参团记录”视图更新，添加两条新记录
insert into 历史参团记录 (职工号, 编号, 参团日期) values 
('w09', 'g01', '2017-12-31'),
('w09', 'g08', '2017-12-30');

-- 4. 对“历史参团记录”视图更新，修改职工“w01”加入“g07”社团的参团日期
update 历史参团记录 set 参团日期 = '2016-05-13' 
where 职工号 = 'w01' and 编号 = 'g07';
```

## 1. 创建数据库

```Plain
-- 1. 在“湖北籍职工”视图中，查找职工“赵子琪”的职工号
select 职工号 from 湖北籍职工 where 姓名 = '赵子琪';

-- 2. 在“社团负责人”视图中，查找“爱电影”社团负责人的姓名
select 负责人姓名 from 社团负责人 where 社团名称 = '爱电影';

-- 3. 在“职工参团情况统计”视图中，查找参团数为3的职工姓名
select 姓名 from 职工参团情况统计 where 参团数 = 3;

-- 4. 在“历史参团记录”视图中，查找职工号为“w01”的参团记录
select 编号, 参团日期 from 历史参团记录 where 职工号 = 'w01';
```

## 3. 从视图中查找数据

功能：通过创建不同类型的触发器，实现数据插入、更新、删除时的约束控制和数据同步更新

# 九、触发器的使用相关SQL

```Plain
-- 初始化职工人数变量（初始值为8）
set @num = 8;

-- 创建触发器：插入职工记录后，职工人数变量加1
create trigger tri_employee_insert after insert on 职工 for each row
begin
  set @num = @num + 1;
end;
```

## 1. 插入职工记录时更新职工人数变量的触发器

```Plain
-- 创建触发器：插入参团记录前，确保参团日期在2010年1月1日之后，不满足则修改为2010-01-01
create trigger tri_join_insert
	before insert on 参加  for each row
begin
  if new.参团日期 < '2010-01-01' then
    set new.参团日期 = '2010-01-01';
  end if;
end;
```

## 2. 控制参团日期插入规则的触发器

```Plain
-- 创建触发器：修改职工年龄前，确保改后年龄不超过60岁，不满足则禁止修改
create trigger tri_employee_update_age
before update on 职工 for each row
begin
  if new.年龄 > 60 then
    signal sqlstate '45000' set message_text = '年龄不能超过60岁';
  end if;
end;
```

## 3. 限制职工年龄修改上限的触发器

```Plain
-- 创建触发器：插入参团记录前，检查职工已加入社团数，超过4个则禁止插入
create trigger tri_join_check_count
before insert on 参加 for each row
begin
  declare count_num int;
  select count(*) into count_num from 参加 where 职工号 = new.职工号;
  if count_num >= 4 then
    signal sqlstate '45000' set message_text = '一个职工最多加入4个社团';
  end if;
end;
```

## 4. 限制职工最多加入4个社团的触发器

```Plain
-- 先删除社会团体表原有的外键约束
alter table 社会团体 drop foreign key 社会团体_ibfk_1;

-- 创建触发器：插入社会团体记录前，检查负责人是否为现有职工，不满足则禁止插入
create trigger tri_society_insert_manager
before insert on 社会团体 for each row
begin
  declare emp_count int;
  select count(*) into emp_count from 职工 where 职工号 = new.负责人;
  if emp_count = 0 then
    signal sqlstate '45000' set message_text = '负责人必须是现有职工';
  end if;
end;
```

## 5. 保证社会团体负责人参照完整性的触发器

```Plain
-- 1. 创建按性别统计职工情况表
create table 按性别统计职工情况 (
  性别 char(1) primary key,
  人数 int,
  平均年龄 decimal(5,1));

-- 2. 初始化按性别统计职工情况表数据
insert into 按性别统计职工情况 (性别, 人数, 平均年龄)
select 性别, count(*), avg(年龄) from 职工 group by 性别;

-- 3. 删除第(1)题创建的同类型触发器（同一张表上同类型触发器只能有一个）
drop trigger if exists tri_employee_insert;

-- 4. 创建触发器：插入职工记录后，同步更新按性别统计职工情况表的人数和平均年龄
create trigger tri_employee_insert_stats
after insert on 职工 for each row
begin
  update 按性别统计职工情况 set 人数 = 人数 + 1 
		where 性别 = new.性别;
  update 按性别统计职工情况 set 平均年龄 = (
		select avg(年龄) from 职工 where 性别 = new.性别) 
  where 性别 = new.性别;
end;
```

## 6. 插入职工时同步更新性别统计信息的触发器

```Plain
-- 创建触发器：删除职工记录后，同步更新按性别统计职工情况表的人数和平均年龄
create trigger tri_employee_delete_stats
after delete on 职工
for each row
begin
  update 按性别统计职工情况 set 人数 = 人数 - 1 
			where 性别 = old.性别;
  update 按性别统计职工情况 set 平均年龄 = (
			select avg(年龄) from 职工 where 性别 = old.性别) 
  where 性别 = old.性别;
end;
```

## 7. 删除职工时同步更新性别统计信息的触发器

## 2. 更新视图

功能：创建名为“职工社团_whl”的数据库，指定字符集为utf8，校验规则为utf8_general_ci

```sql
create database `职工社团_whl` DEFAULT CHARACTER set utf8 COLLATE 'utf8_general_ci';
```

## 2. 创建数据表（含外键约束）

功能：创建“职工”“社会团体”“参加”三张表，并设置外键约束保证数据参照完整性

```sql
-- 创建职工表
create table `职工` (
`职工号` char(3) primary key,
`姓名` varchar(10) not null,
`年龄` tinyint default 25,
`性别` char(1),
`籍贯` varchar(10)
);
-- 创建社会团体表
create table `社会团体` (
`编号` char(3) primary key,
`名称` varchar(20),
`负责人` char(3),
`活动地点` varchar(20),
FOREIGN KEY (负责人) REFERENCES 职工(职工号)
);
-- 创建参加表
create table `参加`(
`职工号` char(3),
`编号` char(3),
`参团日期` date,
primary key ( `职工号`, `编号`),
FOREIGN key (职工号) REFERENCES 职工(职工号),
FOREIGN key (编号) REFERENCES 社会团体(编号)
);
```

# 二、数据插入相关SQL

功能：向三张数据表中批量插入实验指定数据

```sql
-- 插入职工表数据
insert into `职工` (`职工号`,`姓名`,`年龄`,`性别`,`籍贯`) values 
( 'w01', '张国华', 50, '男', '湖北' ),
( 'w02', '赵子琪', 34, '女', '湖北' ),
( 'w03', '刘小霞', 24, '女', '湖南'),
( 'w04', '张涛', 29, '男', '河南'),
( 'w05', '高琪雅', 27, '女', '湖北'),
( 'w06', '王方', 34, '男', '河北'),
( 'w07', '刘长辉', 42, '男', '河南'),
( 'w08', '周密', 44, '女', '湖南');
-- 插入社会团体表数据
INSERT INTO `社会团体` (编号, 名称, 负责人, 活动地点) VALUES
('g01', '爱电影', 'w01', '3楼302'),
('g02', '篮球先锋', 'w03', '室内篮球场'),
('g03', '摄影家协会', 'w01', '4楼406'),
('g04', '美食家', 'w05', '3楼307'),
('g05', '游戏天地', 'w03', '4楼电竞室'),
('g06', '我爱乒乓', 'w07', '3楼303'),
('g07', '宠物世界', 'w01', '3楼309');
-- 插入参加表数据
INSERT INTO `参加` (职工号, 编号, 参团日期) VALUES
('w01', 'g01', '2017/9/9'),
('w01', 'g03', '2018/1/4'),
('w01', 'g07', '2015/4/3'),
('w02', 'g01', '2019/5/6'),
('w02', 'g07', '2015/9/3'),
('w03', 'g04', '2016/5/4'),
('w03', 'g05', '2019/7/19'),
('w05', 'g04', '2017/10/19'),
('w06', 'g01', '2018/6/20'),
('w06', 'g04', '2018/6/21'),
('w06', 'g06', '2017/9/11'),
('w06', 'g07', '2016/2/20'),
('w07', 'g01', '2016/3/29'),
('w07', 'g06', '2014/11/13'),
('w07', 'g03', null);
```

# 三、单表查询相关SQL

## 1. 不带WHERE条件的查询

```sql
-- 1. 查找“职工”表中所有职工的信息
select * from `职工`;

-- 2. 查找“社会团体”表中社团的编号和名称，输出时列名显示为“社团编号”和“社团名称”
select 编号 as 社团编号,名称 as 社团名称 from `社会团体`;

-- 3. 查找参加了社团的职工的职工号（去重）
select distinct 职工号 from `参加`;

-- 4. 将“职工”表中所有职工的年龄加一岁后输出
select 职工号,姓名,年龄+1 as 年龄,性别,籍贯 from `职工`;
```

## 2. 带WHERE条件的查询

```sql
-- 1. 查找“职工”表中男职工的职工号和性别
select 职工号,性别 from 职工 where `性别` = '男';

-- 2. 查找河南或河北籍的职工的职工号和年龄，结果按“年龄”降序排列
select 职工号,年龄 from 职工 where `籍贯` = '河南' or '河北' order by `年龄` desc;

-- 3. 查找“社会团体”表中活动地点在3楼的社团的编号和负责人，结果按“负责人”升序、“编号”降序排列
select 编号,负责人 from 社会团体 where `活动地点` like '3楼%' order by `负责人`,`编号` desc;

-- 4. 查找姓刘的职工的职工号和姓名
select 职工号,姓名 from 职工 where `姓名` like '刘%';

-- 5. 查找参团日期在2017年1月1日到2019年1月1日的职工的参团信息
select 职工号,编号,参团日期 from 参加 where `参团日期` between '2017-01-01' and '2019-01-01';

-- 6. 查找参加了“g01”社团且参团日期在2018年1月1日以前的职工的职工号
select 职工号 from 参加 where 参团日期 < '2018-01-01' and 编号 = 'g01';

-- 7. 查找男职工的平均年龄，为输出的集函数取别名
select avg(年龄) as 男职工平均年龄 from 职工 where `性别` = '男';

-- 8. 查找参团日期不详的职工的参团信息
select 职工号,编号 from 参加 WHERE 参团日期 IS NULL;
```

# 四、多表连接查询相关SQL

```sql
-- 1. 查找男职工的参团信息，要求输出职工号、编号和参团日期
select 职工.职工号,编号,参团日期 
from 职工 join 参加 on 职工.`职工号`=参加.`职工号` 
where `性别` = '男';

-- 2. 查找所有社团的编号、负责人的职工号和姓名
select 社会团体.编号,职工号,姓名 
from 职工 join 社会团体 on  职工.`职工号`=社会团体.`负责人`;

-- 3. 查找职工“张国华”加入的社团的编号和名称
select 社会团体.编号,社会团体.名称 from 职工
join 参加 on 职工.职工号 = 参加.职工号
join 社会团体 on 参加.编号 = 社会团体.编号
where 职工.姓名 = '张国华';

-- 4. 查找加入了“爱电影”或“摄影家协会”社团的职工的姓名和年龄，结果按“年龄”降序和“职工号”升序排列
select 职工.姓名,职工.年龄 from 社会团体
join 参加 on 社会团体.编号 = 参加.编号
join 职工 on 职工.职工号 = 参加.职工号
where 社会团体.名称 = '爱电影' or '摄影家协会'
order by `年龄` desc, 职工.`职工号` asc;

-- 5. 查找所有社团的基本信息和加入了这些社团的参团信息，要求输出表中所有字段
select 社会团体.*,参加.* from 参加
     join 职工 on 职工.职工号 = 参加.职工号
     join 社会团体 on 社会团体.编号 = 参加.编号;

-- 6. 查找籍贯是“湖北”的负责人的姓名
select 职工.姓名 from 社会团体
join 职工 on 社会团体.负责人 = 职工.职工号
where 职工.`籍贯` = '湖北';

-- 7. 查找“张国华”任负责人的社团的编号和活动地点，结果按“编号”升序排列
select 社会团体.编号,社会团体.活动地点 from 职工
join 社会团体 on 社会团体.`负责人` = 职工.`职工号`
where 职工.姓名 = '张国华';

-- 8. 查找既加入了“g01”也加入了“g03”社团的职工的职工号
select 职工号 from 参加
where 参加.`编号` = 'g01'
and 职工号 IN (select 职工号 from 参加 where 编号 = 'g03');

-- 9. 查找同时兼任“g01”和“g05”社团负责人的职工的职工号
select a.负责人 as 职工号 from 社会团体 a 
join 社会团体 b on a.负责人 = b.负责人
where a.编号 = 'g01' and b.编号 = 'g05';
```

# 五、子查询相关SQL

## 1. 使用比较操作符的子查询

```sql
-- 1. 查找“职工”表中年龄比“张涛”大的职工的职工号和年龄
select 职工号,年龄 from 职工
where 年龄>(select 年龄 from 职工 where 姓名 ='张涛');

-- 2. 查找参加了“爱电影”社团的职工的职工号
select 职工号 from 参加
where 编号 = (select 编号 from 社会团体 where 名称 = '爱电影');

-- 3. 查找没有参加“爱电影”社团的职工的职工号
select distinct 职工号 from 参加
where 编号 not in  (select 编号 from 社会团体 where 名称 = '爱电影');

-- 4. 查找在加入了“g01”社团的职工中参团时间早于“王方”的职工的职工号和参团日期
select 职工号,参团日期 from 参加
where 编号 = 'g01' and 参团日期 < (
select 参团日期 from 参加 where 职工号 = (
select 职工号 from 职工 where 姓名 = '王方' limit 1)limit 1);

-- 5. 查找和“摄影家协会”社团是同一个负责人的其他社团的编号
select 编号 from 社会团体
where 负责人 = (
select 负责人 from 社会团体 where 名称 = '摄影家协会' limit 1)
and 名称 != '摄影家协会';
```

## 2. 使用IN操作符的子查询

```sql
-- 1. 查找职工号为“w02”的职工加入的社团的编号和名称
select 编号, 名称 from 社会团体 
where 编号 in (
select 编号 from 参加 where 职工号 = 'w02');

-- 2. 查找没有加入“g01”社团的职工的职工号和姓名
select 职工号, 姓名 from 职工 
where 职工号 not in (
select 职工号 from 参加 where 编号 = 'g01');

-- 3. 查找没有加入任何社团的职工的姓名和籍贯
select 姓名, 籍贯 from 职工 
where 职工号 not in (
select distinct 职工号 from 参加);

-- 4. 查找社团成员全是男职工的社团的编号
select 编号 from 社会团体 
where 编号 not in (
select distinct a.编号 from 参加 a 
join 职工 e on a.职工号 = e.职工号 
where e.性别 = '女'); 
```

## 3. 使用ANY或ALL操作符的子查询

```sql
-- 1. 查找比“河南”籍职工的年龄都大的职工的职工号和年龄
select 职工号, 年龄 from 职工 
where 年龄 > all (
select 年龄 from 职工 where 籍贯 = '河南'); 

-- 2. 在“参加”表中查找最先加入“g01”社团的职工的职工号
select 职工号 from 参加 
where 编号 = 'g01' and 参团日期 = all (
select min(参团日期) from 参加 where 编号 = 'g01');
```

# 六、分组和函数查询相关SQL

## 1. 不带HAVING子句的分组查询

```sql
-- 1. 在“职工”表中按性别统计男女职工的平均年龄
select 性别, avg(年龄) as 平均年龄 from 职工 group by 性别;

-- 2. 在“职工”表中按籍贯统计职工人数
select 籍贯, count(*) as 职工人数 from 职工 group by 籍贯;

-- 3. 在“社会团体”表中统计每位职工负责的社团数
select 负责人, count(*) as 负责社团数 from 社会团体 group by 负责人;

-- 4. 统计每个社团的名称及该社团的加入人数
select s.名称, count(a.职工号) as 加入人数 from 社会团体 s
left join 参加 a on s.编号 = a.编号 
group by s.编号, s.名称;

-- 5. 在“参加”表中，统计每个社团的编号以及最先加入该社团的参团日期
select 编号, min(参团日期) as 最先加入日期 from 参加 group by 编号;
```

## 2. 带HAVING子句的分组查询

```sql
-- 1. 在“参加”表中统计加入了3个及以上社团的职工的职工号
select 职工号 from 参加 group by 职工号 having count(*) >= 3;

-- 2. 在“参加”表中统计加入人数超过3人的社团的名称及参加人数
select s.名称, count(a.职工号) as 参加人数 from 社会团体 s
join 参加 a on s.编号 = a.编号 
group by s.编号, s.名称 
having count(a.职工号) > 3;

-- 3. 在“职工”表中统计职工平均年龄在40岁以上的籍贯信息
select 籍贯 from 职工 group by 籍贯 having avg(年龄) > 40;

-- 4. 在“社会团体”表中统计兼任两个以上社团负责人的职工的姓名
select e.姓名 from 职工 e
join 社会团体 s on e.职工号 = s.负责人 
group by e.职工号, e.姓名 
having count(s.编号) > 2;
```

## 3. 使用集函数的子查询

```sql
-- 1. 查找“河南”籍的职工中年龄最大的职工的职工号和年龄
select 职工号, 年龄 from 职工 
where 籍贯 = '河南' and 年龄 = (
select max(年龄) from 职工 where 籍贯 = '河南');

-- 2. 在“参加”表中查找最先加入“g01”社团的职工的职工号
select 职工号 from 参加 
where 编号 = 'g01' and 参团日期 = (
select min(参团日期) from 参加 where 编号 = 'g01');

-- 3. 查找比女职工平均年龄小的男职工的职工号
select 职工号 from 职工 
where 性别 = '男' and 年龄 < (
select avg(年龄) from 职工 where 性别 = '女'); 
```

# 七、数据操纵（添加、修改、删除）相关SQL

## 1. 往表中添加数据

```sql
-- 1. 往“职工”表中添加一条完整记录：职工号“w09”，姓名“汪伟”，年龄“45”，性别“男”，籍贯“湖北”
insert into 职工 (职工号, 姓名, 年龄, 性别, 籍贯) 
values ('w09', '汪伟', 45, '男', '湖北');

-- 2. 往“职工”表中添加一条个人完整记录，职工号为学号后三位
insert into 职工 (职工号, 姓名, 年龄, 性别, 籍贯) 
values ('123', '张三', 22, '男', '北京');

-- 3. 往“社会团体”表中添加一条完整记录：编号“g08”，名称“趣味编程”，负责人“w01”，活动地点“5楼机房”
insert into 社会团体 (编号, 名称, 负责人, 活动地点) 
values ('g08', '趣味编程', 'w01', '5楼机房');

-- 4. 往“参加”表中添加一条不完整记录：职工号“w01”，编号“g04”
insert into 参加 (职工号, 编号)  values ('w01', 'g04');

-- 5. 往“社会团体”表中添加一条不完整记录：编号“g10”，名称“美术社”，活动地点“3楼305”
insert into 社会团体 (编号, 名称, 活动地点) 
values ('g10', '美术社', '3楼305');

-- 6. 往“参加”表中批量添加个人参加社团记录
insert into 参加 (职工号, 编号, 参团日期) 
values 
('whl', 'g01', '2025/1/1'),
('whl', 'g07', '2025/1/2');
```

## 2. 修改表中数据

```sql
-- 1. 将“职工”表中男职工的年龄加一岁
update 职工 set 年龄 = 年龄 + 1 where 性别 = '男';

-- 2. 将“社会团体”表中原来由w03负责的社团的负责人改为w04
update 社会团体 set 负责人 = 'w04' where 负责人 = 'w03';

-- 3. 将g03社团的活动地点改到“4楼404”
update 社会团体 set 活动地点 = '4楼404' where 编号 = 'g03';

-- 4. 将职工“刘小霞”参加“美食家”社团的参团日期改为“2016-07-03”
update 参加 set 参团日期 = '2016-07-03' 
where 职工号 = (
select 职工号 from 职工 where 姓名 = '刘小霞') 
and 编号 = (
select 编号 from 社会团体 where 名称 = '美食家');

-- 5. 将职工“张国华”担任负责人的社团的参团日期推后两天
update 参加 set 参团日期 = date_add(参团日期, interval 2 day) 
where 编号 in (
select 编号 from 社会团体 where 负责人 = (
select 职工号 from 职工 where 姓名 = '张国华'));
```

## 3. 删除表中数据

```sql
-- 1. 将“职工”表中职工号为“w04”的职工的记录删除（先删关联记录）
delete from 参加 where 职工号 = 'w04';
update 社会团体 set 负责人 = null where 负责人 = 'w04';
delete from 职工 where 职工号 = 'w04';

-- 2. 将“参加”表中“刘小霞”的参团记录删除
delete from 参加 where 职工号 = (
select 职工号 from 职工 where 姓名 = '刘小霞');

-- 3. 将“职工”表中“刘小霞”的记录删除（先删关联记录）
delete from 参加 where 职工号 = (
select 职工号 from 职工 where 姓名 = '刘小霞');

update 社会团体 set 负责人 = null where 负责人 = (
select 职工号 from 职工 where 姓名 = '刘小霞');

delete from 职工 where 姓名 = '刘小霞';

-- 4. 将“社会团体”表中没有职工加入的社团的信息删除
delete from 社会团体 where 编号 not in (
select distinct 编号 from 参加);
```

# 八、视图相关SQL

## 1. 创建视图

```sql
-- 1. 创建湖北籍职工的视图“湖北籍职工”，包含“职工号”“姓名”“籍贯”“年龄”四列
create view 湖北籍职工 as
select 职工号, 姓名, 籍贯, 年龄 from 职工 
where 籍贯 = '湖北';

-- 2. 创建包含2018年以前参团记录的视图“历史参团记录”
create view 历史参团记录 as select 职工号, 编号, 参团日期 from 参加 
where 参团日期 < '2018-01-01';

-- 3. 创建“社团负责人”视图，包含“社团编号”“社团名称”“负责人姓名”三列
create view 社团负责人 as
select s.编号 as 社团编号, s.名称 as 社团名称, e.姓名 as 负责人姓名 from 社会团体 s
join 职工 e on s.负责人 = e.职工号;

-- 4. 创建统计职工参加社团情况的视图“职工参团情况统计”
create view 职工参团情况统计 as
select e.姓名, count(a.编号) as 参团数 from 职工 e
left join 参加 a on e.职工号 = a.职工号 
group by e.职工号, e.姓名;
```

## 2. 更新视图

```sql
-- 1. 对“湖北籍职工”视图更新，将职工号为“w01”的职工年龄加一岁
update 湖北籍职工 set 年龄 = 年龄 + 1 where 职工号 = 'w01';

-- 2. 对“湖北籍职工”视图更新，删除职工号为“w02”的职工记录（先删外键约束）
alter table 参加 drop foreign key 参加_ibfk_1;
delete from 湖北籍职工 where 职工号 = 'w02';
alter table 参加 add constraint 参加_ibfk_1 foreign key (职工号) references 职工(职工号);

-- 3. 对“历史参团记录”视图更新，添加两条新记录
insert into 历史参团记录 (职工号, 编号, 参团日期) values 
('w09', 'g01', '2017-12-31'),
('w09', 'g08', '2017-12-30');

-- 4. 对“历史参团记录”视图更新，修改职工“w01”加入“g07”社团的参团日期
update 历史参团记录 set 参团日期 = '2016-05-13' 
where 职工号 = 'w01' and 编号 = 'g07';
```

## 3. 从视图中查找数据

```sql
-- 1. 在“湖北籍职工”视图中，查找职工“赵子琪”的职工号
select 职工号 from 湖北籍职工 where 姓名 = '赵子琪';

-- 2. 在“社团负责人”视图中，查找“爱电影”社团负责人的姓名
select 负责人姓名 from 社团负责人 where 社团名称 = '爱电影';

-- 3. 在“职工参团情况统计”视图中，查找参团数为3的职工姓名
select 姓名 from 职工参团情况统计 where 参团数 = 3;

-- 4. 在“历史参团记录”视图中，查找职工号为“w01”的参团记录
select 编号, 参团日期 from 历史参团记录 where 职工号 = 'w01';
```

# 九、触发器的使用相关SQL

功能：通过创建不同类型的触发器，实现数据插入、更新、删除时的约束控制和数据同步更新

## 1. 插入职工记录时更新职工人数变量的触发器

```Plain
-- 初始化职工人数变量（初始值为8）
set @num = 8;

-- 创建触发器：插入职工记录后，职工人数变量加1
create trigger tri_employee_insert after insert on 职工 for each row
begin
  set @num = @num + 1;
end;
```

## 2. 控制参团日期插入规则的触发器

```Plain
-- 创建触发器：插入参团记录前，确保参团日期在2010年1月1日之后，不满足则修改为2010-01-01
create trigger tri_join_insert
	before insert on 参加  for each row
begin
  if new.参团日期 < '2010-01-01' then
    set new.参团日期 = '2010-01-01';
  end if;
end;
```

## 3. 限制职工年龄修改上限的触发器

```Plain
-- 创建触发器：修改职工年龄前，确保改后年龄不超过60岁，不满足则禁止修改
create trigger tri_employee_update_age
before update on 职工 for each row
begin
  if new.年龄 > 60 then
    signal sqlstate '45000' set message_text = '年龄不能超过60岁';
  end if;
end;
```

## 4. 限制职工最多加入4个社团的触发器

```Plain
-- 创建触发器：插入参团记录前，检查职工已加入社团数，超过4个则禁止插入
create trigger tri_join_check_count
before insert on 参加 for each row
begin
  declare count_num int;
  select count(*) into count_num from 参加 where 职工号 = new.职工号;
  if count_num >= 4 then
    signal sqlstate '45000' set message_text = '一个职工最多加入4个社团';
  end if;
end;
```

## 5. 保证社会团体负责人参照完整性的触发器

```Plain
-- 先删除社会团体表原有的外键约束
alter table 社会团体 drop foreign key 社会团体_ibfk_1;

-- 创建触发器：插入社会团体记录前，检查负责人是否为现有职工，不满足则禁止插入
create trigger tri_society_insert_manager
before insert on 社会团体 for each row
begin
  declare emp_count int;
  select count(*) into emp_count from 职工 where 职工号 = new.负责人;
  if emp_count = 0 then
    signal sqlstate '45000' set message_text = '负责人必须是现有职工';
  end if;
end;
```

## 6. 插入职工时同步更新性别统计信息的触发器

```Plain
-- 1. 创建按性别统计职工情况表
create table 按性别统计职工情况 (
  性别 char(1) primary key,
  人数 int,
  平均年龄 decimal(5,1));

-- 2. 初始化按性别统计职工情况表数据
insert into 按性别统计职工情况 (性别, 人数, 平均年龄)
select 性别, count(*), avg(年龄) from 职工 group by 性别;

-- 3. 删除第(1)题创建的同类型触发器（同一张表上同类型触发器只能有一个）
drop trigger if exists tri_employee_insert;

-- 4. 创建触发器：插入职工记录后，同步更新按性别统计职工情况表的人数和平均年龄
create trigger tri_employee_insert_stats
after insert on 职工 for each row
begin
  update 按性别统计职工情况 set 人数 = 人数 + 1 
		where 性别 = new.性别;
  update 按性别统计职工情况 set 平均年龄 = (
		select avg(年龄) from 职工 where 性别 = new.性别) 
  where 性别 = new.性别;
end;
```

## 7. 删除职工时同步更新性别统计信息的触发器

```Plain
-- 创建触发器：删除职工记录后，同步更新按性别统计职工情况表的人数和平均年龄
create trigger tri_employee_delete_stats
after delete on 职工
for each row
begin
  update 按性别统计职工情况 set 人数 = 人数 - 1 
			where 性别 = old.性别;
  update 按性别统计职工情况 set 平均年龄 = (
			select avg(年龄) from 职工 where 性别 = old.性别) 
  where 性别 = old.性别;
end;
```