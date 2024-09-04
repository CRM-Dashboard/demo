---------
## Login 
---------
To Login User:
sap/bc/react/crm/login?sap-client=250&sap-user=vishalj&sap-password=Aditya@123
latest:
/api/login

-------------
## HomePage
--------------
To get Project Details:
sap/bc/react/crm/project?sap-client=250&sap-user=vishalj&sap-password=Aditya@123
latest:
/api/project
---------------

## Dashboard -> Home

To get Project Details (Homepage):
sap/bc/react/crm/project?sap-client=250
latest: /api/project

To get customer details in search (Dashboard):
sap/bc/react/crm/search?sap-client=250&projectId={<from above api>}

To get Card details and Main page details:
sap/bc/react/crm/summary?sap-client=250&projectId={<from above api>}

To show aging graph:
sap/bc/react/crm/aging?sap-client=250&projectId={<from above api>}

To Show Collection Trend:
sap/bc/react/crm/projectf3?sap-client=250&projectId=1304&sap-user=vishalj&sap-password=Aditya@123

To show Sentiment Analysis and Happiness Meter:
sap/bc/react/crm/customer?sap-client=250&projectId=1304&sap-user=vishalj&sap-password=Aditya@123

---

## Dashboard -> Payment Schedule

To get Payment Schedule table data:
sap/bc/react/crm/plan?sap-client=250&vbeln=2100001649

---

## Dashboard -> Invoice Details

To get Invoice table data:
sap/bc/crm/invoices?sap-client=250&vbeln=2100001649&sap-user=vishalj&sap-password=Aditya@123

To send mail:
sap/bc/react/crm/invoice_mail?sap-client=250

To fetch PDF content:
sap/bc/crm/invoice_print?sap-client=250&vbeln=3130000021&sap-user=vishalj&sap-password=Aditya@123

---

## Dashboard -> Payment Details

To get Payment details in table:
sap/bc/react/crm/so_receipt?sap-client=250&vbeln=2100001649&sap-user=vishalj&sap-password=Aditya@123

To Create New payment receipt:
sap/bc/react/crm/receipt_create?sap-client=250

To send mail:
sap/bc/react/crm/receipt_mail?sap-client=250

To fetch PDF content:
sap/bc/react/crm/receipt_print?sap-client=250&vbeln=2100001649&kunnr=1000005363&recpt_no=2023032065

---

## Dashboard -> Interest Details

To get Interest Details in table:
sap/bc/react/crm/interest?sap-client=250&vbeln=2100001649

---

## Dashboard -> Pre-EMI/Rental:

To get Pre EMI/Rental table details:
sap/bc/react/crm/repay?sap-client=250&vbeln=2100001649

to create Pre EMI/Rental receipt:
sap/bc/react/crm/repay_create?sap-client=250

---

## Dashbaord -> Interest WaiveOff :

To get Interest Waive off table details:
/sap/bc/react/crm/waiveint?sap-client=250&vbeln=${2100002235}

---

## Dashboard -> Service Request :

To get data for table and cards:
https://geraworld3dev.azurewebsites.net/api/query/GetByProjectTPId?ProjectTPId=1304

---

## Dashboard -> Email Report :

To get data for table details :
sap/bc/react/crm/maillog?sap-client=250&email=er.sumansingh@gmail.com

---

## Invoices :

To get table Details:
sap/bc/react/crm/so_invoices_dt?sap-client=250&werks=1304&fkdat=23/02/2024&sap-user=vishalj&sap-password=Aditya

Send Mail:
sap/bc/react/crm/invoice_mail?sap-client=250

---

## Call History :

To get call history details:
http://localhost:5000/api/exotel/calls
latest:
/api/exotel/calls

## Click to call:

latest:
api/exotel/make-call
