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
const port=2410;

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
    let maxid=arr1.reduce((acc,curr)=>curr.shopid>=acc?curr.shopid:acc, 0)
    let newid=maxid+1;
    let newShop={shopid:newid, ...body};
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
        let maxid=arr1.reduce((acc,curr)=>curr.productid>=acc?curr.productid:acc, 0)
        let newid=maxid+1;
        let newProduct={productid:newid,...body};
        arr1.push(newProduct);
        res.send(newProduct);
    });
    app.get("/products/:id", function(req,res){
        let id=req.params.id;
        let arr1=shopData.products
        let data=arr1.find((st)=>st.productid == id);
        res.send(data);
     });
    
    app.put("/products/:productid",function(req,res){
        let productid=+req.params.productid;
        let body=req.body;
        let arr1=shopData.products
        let index=arr1.findIndex((st)=>st.productid==productid);
        if(index>=0){
            let updatedProduct={...body,productid:productid};
            arr1[index]=updatedProduct;
            console.log("aa",updatedProduct)
           res.send(updatedProduct);
        }
        else {res.status(404).send("No product found");}
    });

 
       

    app.delete("/products/:productid",function(req,res){
        let productid=+req.params.productid;
        let arr1=shopData.products
        let index=arr1.findIndex((st)=>st.productid===productid);
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
        let pp=shop.substring(2,3)
        let shopArr=pp.split(",");
        arr1=arr1.filter((st)=>shopArr.find((c1)=>c1==st.shopid));
        console.log(shopArr)
       
    }
    if(product) {
        
        let productArr=product.split("pr")
      
        arr1=arr1.filter((st)=>productArr.find((c1)=>c1.includes(st.productid)));
        console.log(productArr)
      
        console.log(product)
    }
            res.send(arr1);  
    });

    app.get("/purchases/shops/:id",function(req,res){
            let id=+req.params.id;
            let arr1=shopData.purchases
        let arr2=shopData.shops
      
        find=arr2.filter((f)=>f.shopid==id);
        let arr=arr1.filter((f)=>find.find(s=>s.shopid==f.shopid))
         
        json=arr.map(st=>(
         
     ({purchaseid:st.purchaseid,name:find[0].name,rent:find[0].rent,quantity:st.quantity,price:st.price })))
   
      res.send(json)
    });

    app.get("/purchases/products/:id",function(req,res){
        let id=+req.params.id;
        let arr1=shopData.purchases
        let arr2=shopData.products
      
        find=arr2.filter((f)=>f.productid==id);
        let arr=arr1.filter((f)=>find.find(s=>s.productid==f.productid))
 
        json=arr.map(st=>(
         
     ({purchaseid:st.purchaseid,productname:find[0].productname,category:find[0].category,description:find[0].description,quantity:st.quantity,price:st.price })))
   
      res.send( json)
});


app.get("/totalPurchase/shop/:id",function(req,res){
    let id=+req.params.id;
    let arr1=shopData.purchases
    let arr2=shopData.shops
   
let count=1;
 let arr4=arr1.filter((f)=>f.productid===id)

let combined = Object.values(arr4.reduce((a,c) => { 
    let e = (a[c.shopid] = a[c.shopid] 
        || {purchaseid:c.purchaseid,productid:c.productid,shopid:c.shopid,productid:c.productid,quantity:0});
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
 let arr4=arr1.filter((f)=>f.shopid===id)


let combined = Object.values(arr4.reduce((a,c) => { 
  let e = (a[c.productid] = a[c.productid] || {purchaseid:c.purchaseid,shopid:c.shopid,productid:c.productid,quantity:0});

  e.quantity+=c.quantity;
  return a;
}, {}))
   

  res.send(combined);
});


app.post("/purchases", function(req, res){
    let body=req.body;
    console.log(body);
    let arr1=shopData.purchases
    let maxid=arr1.reduce((acc,curr)=>curr.purchaseid>=acc?curr.purchaseid:acc, 0)
    let newid=maxid+1;
    let newpurchase={purchaseid:newid, ...body};
    arr1.push(newpurchase);
    res.send(newpurchase);
});
