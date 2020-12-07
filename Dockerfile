FROM dv66/angular-base-image		
RUN mkdir mem-web	
COPY . /mem-web	
RUN npm --prefix /mem-web install		
EXPOSE 4200		
ENTRYPOINT ["npm", "--prefix", "/mem-web", "start"]		