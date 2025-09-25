from pydantic import BaseModel

class ProductCreate(BaseModel):
    productname: str
    price: int
    company: str
    category: str

class ProductResponse(ProductCreate):
    id: int

    class Config:
        orm_mode = True
