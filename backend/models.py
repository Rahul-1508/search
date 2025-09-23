from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "product"
    id = Column(Integer, primary_key=True, index=True)
    productname = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
