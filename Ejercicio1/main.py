#importamos el modulo con la funcion 
from fTipoNumero import *

#Lista de numero a procesar
listaNumeros=[70,3,6,76,140,12,13,28,19,45,48]

listaProcesados=fPerfetoAbundateDefectivo(listaNumeros)

#Recorremos la lista y formateamos la salida con la información de cada numero
for i in listaProcesados:
	numerosDivisores="+".join([str(x) for x in i[2])
	print "El número %d es un número %s. Suma de la lista de sus divisores propios: %s = %d" & (i[0],i[1],numerosDivisores,i[3])