from pydantic import BaseModel

class ProductBase(BaseModel):
    productname: str
    price: int

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        orm_mode = True
