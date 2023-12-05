let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Orihgin, X-Requested-With, Content-Type, Accept"

    );
    next();
});
//const port=2410;
var port = process.env.PORT || 2410
app.listen(port,()=>console.log(`Listening on port ${port}!`));

let { shopData }=require("./data.js");


app.get("/shops", function(req,res){
arr1=shopData.shops
    res.send(arr1);  
});

app.post("/shops", function(req, res){
    let body=req.body;
    console.log(body);
    let arr1=shopData.shops
    let maxid=arr1.reduce((acc,curr)=>curr.shopId>=acc?curr.shopId:acc, 0)
    let newid=maxid+1;
    let newShop={shopId:newid, ...body};
    arr1.push(newShop);
    res.send(newShop);
});

app.get("/products", function(req,res){
    arr1=shopData.products
        res.send(arr1);  
    });
    
    app.post("/products", function(req, res){
        let body=req.body;
        console.log(body);
        let arr1=shopData.products
        let maxid=arr1.reduce((acc,curr)=>curr.productId>=acc?curr.productId:acc, 0)
        let newid=maxid+1;
        let newProduct={productId:newid,...body};
        arr1.push(newProduct);
        res.send(newProduct);
    });

    app.put("/products/:productId",function(req,res){
        let productId=+req.params.productId;
        let body=req.body;
        let arr1=shopData.products
        let index=arr1.findIndex((st)=>st.productId===productId);
        if(index>=0){
            let updatedProduct={productId:productId,...body};
            arr1[index]=updatedProduct;
           res.send(updatedProduct);
        }
        else {res.status(404).send("No product found");}
    
    });

    app.delete("/products/:productId",function(req,res){
        let productId=+req.params.productId;
        let arr1=shopData.products
        let index=arr1.findIndex((st)=>st.productId===productId);
        if(index>=0){
            let deletedProduct=arr1.splice(index,1);
           res.send(deletedProduct);
        }
        else
        { res.status(404).send("No product found"); }
    
    });


    app.get("/purchases", function(req,res){
    let sort=req.query.sort;
    let shop=req.query.shop;
    let product=req.query.product;
    let arr1=shopData.purchases
    let arr2=shopData.products
    let arr3=shopData.shops
 
        if(sort==="QtyAsc") {
        
            arr1=arr1.sort((st1,st2)=> st1.quantity-st2.quantity);
        }
        if(sort==="QtyDesc") {
            
            arr1=arr1.sort((st1,st2)=> -st1.quantity+st2.quantity);
        }
        if(sort==="ValueAsc") {
            arr1=arr1.sort((st1,st2)=> (st1.quantity*st1.price)-(st2.quantity*st2.price));
        }
        if(sort==="ValueDesc") {
            arr1=arr1.sort((st1,st2)=> -(st1.quantity*st1.price)+(st2.quantity*st2.price));
        }
    
    if(shop) {
        let shopArr=shop.split(",");
        arr1=arr1.filter((st)=>shopArr.find((c1)=>c1==st.shopId));
    }
    if(product) {
            let productArr=product.split(",");
          arr1=arr1.filter((st)=>productArr.find((c1)=>c1==st.productid));
   
    }
            res.send(arr1);  
    });
    app.get("/purchases/shops/:id",function(req,res){
            let id=+req.params.id;
            let arr1=shopData.purchases
        let arr2=shopData.shops
      
        find=arr2.filter((f)=>f.shopId==id);
        let arr=arr1.filter((f)=>find.find(s=>s.shopId==f.shopId))
  console.log("find",find)
  console.log("arr",arr)
         
        json=arr.map(st=>(
         
     ({purchaseId:st.purchaseId,name:find[0].name,rent:find[0].rent,quantity:st.quantity,price:st.price })))
   
      res.send(json)
    });

    app.get("/purchases/products/:id",function(req,res){
        let id=+req.params.id;
        let arr1=shopData.purchases
        let arr2=shopData.products
      
        find=arr2.filter((f)=>f.productId==id);
        let arr=arr1.filter((f)=>find.find(s=>s.productId==f.productid))
 
        json=arr.map(st=>(
         
     ({purchaseId:st.purchaseId,productName:find[0].productName,category:find[0].category,description:find[0].description,quantity:st.quantity,price:st.price })))
   
      res.send( json)
});


app.get("/totalPurchase/shop/:id",function(req,res){
    let id=+req.params.id;
    let arr1=shopData.purchases
    let arr2=shopData.shops
   
let count=1;
 let arr4=arr1.filter((f)=>f.shopId===id)
 let combined = Object.values(arr4.reduce((a,c) => { 
    let e = (a[c.productid] = a[c.productid] || {purchaseId:c.purchaseId,shopId:c.shopId,productid:c.productid,quantity:0});
    e.quantity+=c.quantity;
    return a;
  }, {}))
     
    res.send(combined);
});

app.get("/totalPurchase/product/:id",function(req,res){
    let id=+req.params.id;
    let arr1=shopData.purchases
    let arr2=shopData.products
    let arr3=shopData.shops;
let count=1;
 let arr4=arr1.filter((f)=>f.productid===id)
 


   /* const totals = [];
     arr4.forEach(x => {

        let obj = totals.find(o => o.shopId == x.shopId);
     
      if (obj) {
        obj.total = obj.quantity + x.quantity;
      } else {
        totals.push(x);
      }
     console.log("total",totals)
});
   */let combined = Object.values(arr4.reduce((a,c) => { 
  let e = (a[c.shopId] = a[c.shopId] || {purchaseId:c.purchaseId,shopId:c.shopId,productid:c.productid,quantity:0});

  e.quantity+=c.quantity;
  return a;
}, {}))
   

  res.send(combined);
});


app.post("/purchases", function(req, res){
    let body=req.body;
    console.log(body);
    let arr1=shopData.purchases
    let maxid=arr1.reduce((acc,curr)=>curr.purchaseId>=acc?curr.purchaseId:acc, 0)
    let newid=maxid+1;
    let newpurchase={purchaseId:newid, ...body};
    arr1.push(newpurchase);
    res.send(newpurchase);
});
