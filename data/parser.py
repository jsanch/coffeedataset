import csv
import collections
import json

fyle =  open("a3-CoffeeData.csv","rU")
reader = csv.reader(fyle)

headers = ""
coffee_data = [] 

for i,row in enumerate(reader):
  if i == 0:
    headers = row;
  else:
    coffee_data.append(row)

dyct= collections.OrderedDict()
for row in coffee_data:
  date = row[0]
  sales = int(row[1])
  profit = int(row[2])
  if date not in dyct:
    dyct[date] = { "sales": sales, "profit": profit, "date":date} 
  else:
    dyct[date]["sales"] += sales
    dyct[date]["profit"] += profit

print json.dumps(dyct)
# dic = []
# # # count = 0 
# for key, value in dyct.items():
#   temp = [value]
#   list.append(temp)
# print list
# dicc = {}
# dict["1"] = { "list": list}
# print json.dumps(dict)

# print 'date', 'sales', 'profit'
# for key,val in dyct.items():
#   print key, val['sales'], val['profit']


