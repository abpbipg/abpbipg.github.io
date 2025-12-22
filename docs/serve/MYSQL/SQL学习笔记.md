# 数据库与表创建相关SQL

## 一. 创建数据库

功能：创建名为“职工社团_whl”的数据库，指定字符集为utf8，校验规则为utf8_general_ci

```Plain
create database `职工社团_whl` DEFAULT CHARACTER set utf8 COLLATE 'utf8_general_ci';
```

## 二. 创建数据表（含外键约束）

功能：创建“职工”“社会团体”“参加”三张表，并设置外键约束保证数据参照完整性

```Plain
-- 创建职工表
create table `职工` (
`职工号` char(3) primary key,
`姓名` varchar(10) not null,
`年龄` tinyint default 25,
`性别` char(1),
`籍贯` varchar(10));

-- 创建社会团体表
create table `社会团体` (
`编号` char(3) primary key,
`名称` varchar(20),
`负责人` char(3),
`活动地点` varchar(20),
FOREIGN KEY (负责人) REFERENCES 职工(职工号));

-- 创建参加表
create table `参加`(
`职工号` char(3),
`编号` char(3),
`参团日期` date,
primary key ( `职工号`, `编号`),
FOREIGN key (职工号) REFERENCES 职工(职工号),
FOREIGN key (编号) REFERENCES 社会团体(编号));
```

## 三、数据插入相关SQL

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
('w07', 'g03', null),
('w07', 'g06', '2014/11/13');
```

# 2、单表查询实验内容

## 2.1 不带 WHERE 条件的查询

### 2.1.1 查找“职工”表中所有职工的信息
```sql
select * from `职工`;
```

### 2.1.2 查找“社会团体”表中社团的编号和名称
```sql
select 编号 as 社团编号, 名称 as 社团名称 from `社会团体`;
```

### 2.1.3 查找参加了社团的职工的职工号
```sql
select distinct 职工号 from `参加`;
```

### 2.1.4 将“职工”表中所有职工的年龄加一岁后输出
```sql
select 职工号, 姓名, 年龄 + 1 as 年龄, 性别, 籍贯 from `职工`;
```

## 2.2 带 WHERE 条件的查询

### 2.2.1 查找“职工”表中男职工的职工号和性别
```sql
select 职工号, 性别 from 职工 where `性别` = '男';
```

### 2.2.2 查找河南或河北籍职工的职工号和年龄（按年龄降序）
```sql
select 职工号,年龄 from 职工 where `籍贯` = '河南' or '河北' order by `年龄` desc;
```

### 2.2.3 查找活动地点在 3 楼的社团编号和负责人（负责人升序、编号降序）
```sql
select 编号,负责人 from 社会团体 where `活动地点` like '3楼%' order by `负责人`,`编号` desc;
```

### 2.2.4 查找姓刘的职工的职工号和姓名
```sql
select 职工号,姓名 from 职工 where `姓名` like '刘%';
```

### 2.2.5 查找参团日期在 2017-01-01 到 2019-01-01 的参团信息
```sql
select 职工号,编号,参团日期 from 参加 where `参团日期` between '2017-01-01' and '2019-01-01';
```

### 2.2.6 查找参加 g01 且参团日期在 2018-01-01 之前的职工号
```sql
select 职工号 from 参加 where 参团日期 < '2018-01-01' and 编号 = 'g01';
```

### 2.2.7 查找男职工平均年龄（集函数别名：男职工平均年龄）
```sql
select avg(年龄) as 男职工平均年龄 from 职工 where `性别` = '男';
```

### 2.2.8 查找参团日期不详（NULL）的参团信息
```sql
select 职工号,编号 from 参加 WHERE 参团日期 is null;
```

---

# 3、多表连接查询实验内容

## 3.1 查找男职工的参团信息（职工号、编号、参团日期）
```sql
select 职工.职工号,编号,参团日期 
			from 职工 join 参加 on 职工.`职工号`=参加.`职工号` 
					where `性别` = '男';
```

## 3.2 查找所有社团的编号、负责人的职工号和姓名
```sql
select 社会团体.编号,职工号,姓名 
			from 职工 join 社会团体 on  职工.`职工号`=社会团体.`负责人`;
```

## 3.3 查找职工“张国华”加入的社团编号和名称
```sql
select 社会团体.编号,社会团体.名称 from 职工
			join 参加 on 职工.职工号 = 参加.职工号
			join 社会团体 on 参加.编号 = 社会团体.编号
								where 职工.姓名 = '张国华';
```

## 3.4 查找加入“爱电影”或“摄影家协会”的职工姓名和年龄（年龄降序、职工号升序）
```sql
select 职工.姓名,职工.年龄 from 社会团体
			join 参加 on 社会团体.编号 = 参加.编号
			join 职工 on 职工.职工号 = 参加.职工号
						where 社会团体.名称 = '爱电影' or '摄影家协会'
								order by `年龄` desc, 职工.`职工号` asc;
```

## 3.5 查找所有社团基本信息及参团信息（输出所有字段）
```sql
select 社会团体.*,参加.* from 参加
	     join 职工 on 职工.职工号 = 参加.职工号
	     join 社会团体 on 社会团体.编号 = 参加.编号;
```

## 3.6 查找籍贯为“湖北”的负责人的姓名
```sql
select 职工.姓名 from 社会团体
	join 职工 on 社会团体.负责人 = 职工.职工号
			where 职工.`籍贯` = '湖北';
```

## 3.7 查找“张国华”任负责人的社团编号和活动地点
```sql
select 社会团体.编号,社会团体.活动地点 from 职工
		join 社会团体 on 社会团体.`负责人` = 职工.`职工号`
						where 职工.姓名 = '张国华';
```

## 3.8 查找既加入 g01 也加入 g03 的职工号
```sql
select 职工号 from 参加
		where 参加.`编号` = 'g01'
			and 职工号 IN (select 职工号 from 参加 where 编号 = 'g03');
```

## 3.9 查找同时兼任 g01 和 g05 社团负责人的职工号
```sql
select a.负责人 as 职工号 from 社会团体 a 
		join 社会团体 b on a.负责人 = b.负责人
			where a.编号 = 'g01' and b.编号 = 'g05';
```

---

# 4、子查询实验内容

## 4.1 使用比较操作符的子查询

### 4.1.1 查找年龄比“张涛”大的职工号和年龄
```sql
select 职工号,年龄 from 职工
		where 年龄 > (select 年龄 from 职工 where 姓名 ='张涛');
```

### 4.1.2 查找参加“爱电影”社团的职工号
```sql
select 职工号 from 参加
		where 编号 = (select 编号 from 社会团体 where 名称 = '爱电影');
```

### 4.1.3 查找没有参加“爱电影”社团的职工号
```sql
select distinct 职工号 from 参加
		where 编号 not in  (select 编号 from 社会团体 where 名称 = '爱电影');
```

### 4.1.4 查找 g01 中参团时间早于“王方”的职工号和参团日期
```sql
select 职工号,参团日期 from 参加
	where 编号 = 'g01' and 参团日期 < (
		select 参团日期 from 参加 where 职工号 = (
			select 职工号 from 职工 where 姓名 = '王方' limit 1)limit 1);
```

### 4.1.5 查找与“摄影家协会”同一负责人的其他社团编号
```sql
select 编号 from 社会团体
		where 负责人 = (
				select 负责人 from 社会团体 limit 1);
```

## 4.2 使用 IN 操作符的子查询

### 4.2.1 查找 w02 加入的社团编号和名称
```sql
select 编号, 名称 from 社会团体 
		where 编号 in (
				select 编号 from 参加 where 职工号 = 'w02');
```

### 4.2.2 查找未加入 g01 的职工号和姓名
```sql
select 职工号, 姓名 from 职工 
		where 职工号 not in (
				select 职工号 from 参加 where 编号 = 'g01');
```

### 4.2.3 查找未加入任何社团的职工姓名和籍贯
```sql
select 姓名, 籍贯 from 职工 
		where 职工号 not in (
				select distinct 职工号 from 参加);
```

### 4.2.4 查找成员全是男职工的社团编号
```sql
select 编号 from 社会团体 
		where 编号 not in (
			select distinct a.编号 from 参加 a 
			join 职工 e on a.职工号 = e.职工号 
					where e.性别 = '男'); 
```

## 4.3 使用 ANY / ALL 操作符的子查询

### 4.3.1 查找比所有河南籍职工年龄都大的职工号和年龄
```sql
select 职工号, 年龄 from 职工 
			where 年龄 > all (
			select 年龄 from 职工 where 籍贯 = '河南');
```

### 4.3.2 查找最先加入 g01 的职工号
```sql
select 职工号 from 参加 
			where 编号 = 'g01' and 参团日期 = all (
			select min(参团日期) from 参加 where 编号 = 'g01');
```

---

# 5、分组和函数查询实验内容

## 5.1 不带 HAVING 子句的分组查询

### 5.1.1 按性别统计平均年龄
```sql
select 性别, avg(年龄) as 平均年龄 from 职工 group by 性别;
```

### 5.1.2 按籍贯统计职工人数
```sql
select 籍贯, count(*) as 职工人数 from 职工 group by 籍贯;
```

### 5.1.3 统计每位职工负责的社团数
```sql
select 负责人, count(*) as 负责社团数 from 社会团体 group by 负责人;
```

### 5.1.4 统计每个社团名称及加入人数
```sql
select s.名称, count(a.职工号) as 加入人数 from 社会团体 s
			left join 参加 a on s.编号 = a.编号 
			group by s.编号, s.名称;
```

### 5.1.5 统计每个社团最先加入日期
```sql
select 编号, min(参团日期) as 最先加入日期 from 参加 group by 编号;
```

## 5.2 带 HAVING 子句的分组查询

### 5.2.1 统计加入 3 个及以上社团的职工号
```sql
select 职工号 from 参加 group by 职工号 having count(*) >= 3;
```

### 5.2.2 统计加入人数超过 3 人的社团名称及参加人数
```sql
select s.名称, count(a.职工号) as 参加人数 from 社会团体 s
			join 参加 a on s.编号 = a.编号 
				group by s.编号, s.名称 
						having count(a.职工号) > 3;
```

### 5.2.3 统计平均年龄在 40 岁以上的籍贯信息
```sql
select 籍贯 from 职工 group by 籍贯 having avg(年龄) > 40;
```

### 5.2.4 统计兼任两个以上社团负责人的职工姓名
```sql
select e.姓名 from 职工 e
			join 社会团体 s on e.职工号 = s.负责人 
				group by e.职工号, e.姓名 
						having count(s.编号) > 2;
```

## 5.3 使用集函数的子查询

### 5.3.1 查找“河南”籍中年龄最大的职工号和年龄
```sql
select 职工号, 年龄 from 职工 
			where 籍贯 = '河南' and 年龄 = (
					select max(年龄) from 职工 where 籍贯 = '河南');
```

### 5.3.2 查找最先加入 g01 的职工号
```sql
select 职工号 from 参加 
			where 编号 = 'g01' and 参团日期 = (
					select min(参团日期) from 参加 where 编号 = 'g01');
```

### 5.3.3 查找比女职工平均年龄小的男职工号
```sql
select 职工号 from 职工 
			where 性别 = '男' and 年龄 < (
					select avg(年龄) from 职工 where 性别 = '女');
```

---

# 6、表数据的添加、删除和修改

## 6.1 添加数据（INSERT）

### 6.1.1 添加职工：w09 汪伟 45 男 湖北
```sql
insert into 职工 (职工号, 姓名, 年龄, 性别, 籍贯)
values ('w09', '汪伟', 45, '男', '湖北');
```

### 6.1.2 添加你的完整记录（示例：学号后三位 123）
```sql
insert into 职工 (职工号, 姓名, 年龄, 性别, 籍贯)
values ('123', '张三', 22, '男', '北京');
```

### 6.1.3 添加社团：g08 趣味编程 负责人 w01 5楼机房
```sql
insert into 社会团体 (编号, 名称, 负责人, 活动地点)
values ('g08', '趣味编程', 'w01', '5楼机房');
```

### 6.1.4 添加参团记录（不完整）：w01 加入 g04
```sql
insert into 参加 (职工号, 编号)
values ('w01', 'g04');
```

### 6.1.5 添加社团记录（不完整）：g10 美术社 3楼305
```sql
insert into 社会团体 (编号, 名称, 活动地点)
values ('g10', '美术社', '3楼305');
```

### 6.1.6 批量添加你的参团记录（示例：whl）
```sql
insert into 参加 (职工号, 编号, 参团日期)
values
('whl', 'g01', '2025/1/1'),
('whl', 'g07', '2025/1/2');
```

## 6.2 修改数据（UPDATE）

### 6.2.1 男职工年龄 +1
```sql
update 职工 set 年龄 = 年龄 + 1 where 性别 = '男';
```

### 6.2.2 将原由 w03 负责的社团负责人改为 w04
```sql
update 社会团体 set 负责人 = 'w04' where 负责人 = 'w03';
```

### 6.2.3 将 g03 活动地点改为 4楼404
```sql
update 社会团体 set 活动地点 = '4楼404' where 编号 = 'g03';
```

### 6.2.4 将“刘小霞”参加“美食家”的参团日期改为 2016-07-03
```sql
update 参加 set 参团日期 = '2016-07-03'
where 职工号 = (select 职工号 from 职工 where 姓名 = '刘小霞')
  and 编号 = (select 编号 from 社会团体 where 名称 = '美食家');
```

### 6.2.5 将“张国华”负责社团的参团日期推后两天
```sql
update 参加 set 参团日期 = date_add(参团日期, interval 2 day)
where 编号 in (
  select 编号 from 社会团体
  where 负责人 = (select 职工号 from 职工 where 姓名 = '张国华'));
```

## 6.3 删除数据（DELETE）

### 6.3.1 删除职工号为 w04 的职工记录（含关联处理）
```sql
delete from 参加 where 职工号 = 'w04';
update 社会团体 set 负责人 = null where 负责人 = 'w04';
delete from 职工 where 职工号 = 'w04';
```

### 6.3.2 删除“刘小霞”的参团记录
```sql
delete from 参加
where 职工号 = (select 职工号 from 职工 where 姓名 = '刘小霞');
```

### 6.3.3 删除“刘小霞”的职工记录（含关联处理）
```sql
delete from 参加
where 职工号 = (select 职工号 from 职工 where 姓名 = '刘小霞');

update 社会团体 set 负责人 = null
where 负责人 = (select 职工号 from 职工 where 姓名 = '刘小霞');

delete from 职工 where 姓名 = '刘小霞';
```

### 6.3.4 删除没有职工加入的社团
```sql
delete from 社会团体
where 编号 not in (select distinct 编号 from 参加);
```

---

# 7、视图的使用实验内容

## 7.1 创建视图

### 7.1.1 创建视图“湖北籍职工”
```sql
create view 湖北籍职工 as
		select 职工号, 姓名, 籍贯, 年龄 from 职工 
			where 籍贯 = '湖北';
```

### 7.1.2 创建视图“历史参团记录”（2018 年以前）
```sql
create view 历史参团记录 as select 职工号, 编号, 参团日期 from 参加 
where 参团日期 < '2018-01-01';
```

### 7.1.3 创建视图“社团负责人”
```sql
create view 社团负责人 as
		select s.编号 as 社团编号, s.名称 as 社团名称, e.姓名 as 负责人姓名 from 社会团体 s
		join 职工 e on s.负责人 = e.职工号;
```

### 7.1.4 创建视图“职工参团情况统计”
```sql
create view 职工参团情况统计 as
		select e.姓名, count(a.编号) as 参团数 from 职工 e
		left join 参加 a on e.职工号 = a.职工号 
				group by e.职工号, e.姓名;
```

## 7.2 更新视图

### 7.2.1 更新“湖北籍职工”：w01 年龄 +1
```sql
update 湖北籍职工 set 年龄 = 年龄 + 1 where 职工号 = 'w01';
```

### 7.2.2 更新“湖北籍职工”：删除 w02（处理外键约束）
```sql
alter table 参加 drop foreign key 参加_ibfk_1;
delete from 湖北籍职工 where 职工号 = 'w02';
alter table 参加 add constraint 参加_ibfk_1 foreign key (职工号) references 职工(职工号);
```

### 7.2.3 更新“历史参团记录”：插入两条新记录
```sql
insert into 历史参团记录 (职工号, 编号, 参团日期) values
('w09', 'g01', '2017-12-31'),
('w09', 'g08', '2017-12-30');
```

### 7.2.4 更新“历史参团记录”：修改 w01 加入 g07 的参团日期
```sql
update 历史参团记录
set 参团日期 = '2016-05-13'
where 职工号 = 'w01' and 编号 = 'g07';
```

## 7.3 从视图中查询数据

### 7.3.1 在“湖北籍职工”中查找“赵子琪”的职工号
```sql
select 职工号 from 湖北籍职工 where 姓名 = '赵子琪';
```

### 7.3.2 在“社团负责人”中查找“爱电影”社团负责人的姓名
```sql
select 负责人姓名 from 社团负责人 where 社团名称 = '爱电影';
```

---

# 8、触发器的使用实验内容

## 8.1 职工表 AFTER INSERT：插入职工记录时 @num +1
```sql
set @num = 8;
create trigger tri_employee_insert after insert on 职工 for each row
begin
  set @num = @num + 1;
end;
```

## 8.2 参加表 BEFORE INSERT：参团日期不得早于 2010-01-01（否则改为 2010-01-01）
```sql
create trigger tri_join_insert
	before insert on 参加  for each row
begin
  if new.参团日期 < '2010-01-01' then
    set new.参团日期 = '2010-01-01';
  end if;
end;
```

## 8.3 职工表 BEFORE UPDATE：修改后年龄不得超过 60
```sql
create trigger tri_employee_update_age
before update on 职工 for each row
begin
  if new.年龄 > 60 then
    signal sqlstate '45000' set message_text = '年龄不能超过60岁';
  end if;
end;
```

## 8.4 参加表 BEFORE INSERT：一个职工最多加入 4 个社团
```sql
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

## 8.5 社会团体：删除外键后用触发器保证负责人必须存在
```sql
alter table 社会团体 drop foreign key 社会团体_ibfk_1;

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

## 8.6 统计表与触发器：按性别统计职工情况（建表 + 初始化）
```sql
create table 按性别统计职工情况 (
  性别 char(1) primary key,
  人数 int,
  平均年龄 decimal(5,1));
  
insert into 按性别统计职工情况 (性别, 人数, 平均年龄)
select 性别, count(*), avg(年龄) from 职工 group by 性别;
```

## 8.7 职工表 AFTER INSERT：插入记录后更新统计表
> 注意：同一张表上，同类型（after insert）的触发器只能有一个；需先删除旧触发器。
```sql
drop trigger if exists tri_employee_insert;
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

## 8.8 职工表 AFTER DELETE：删除记录后更新统计表
```sql
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