import numpy as np, wave
SR=44100; DUR=44.6; N=int(DUR*SR); rng=np.random.default_rng(11)
tt=lambda d: np.arange(int(d*SR))/SR
def env(n,a=0.005,r=0.2):
    e=np.ones(n); na=max(1,int(a*SR)); nr=max(1,int(r*SR)); e[:na]=np.linspace(0,1,na); e[-nr:]=np.minimum(e[-nr:],np.linspace(1,0,nr)); return e
def put(buf,t0,x,g=1.0,pan=0.0):
    i=int(t0*SR); n=min(len(x),N-i)
    if n<=0: return
    buf[0,i:i+n]+=x[:n]*g*(1-max(0,pan)); buf[1,i:i+n]+=x[:n]*g*(1+min(0,pan))
def noise(d): return rng.standard_normal(int(d*SR))
def lp(x,fc):
    a=np.exp(-2*np.pi*fc/SR); y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s=(1-a)*x[i]+a*s; y[i]=s
    return y
def hp(x,fc): return x-lp(x,fc)
def bp(x,lo,hi): return lp(hp(x,lo),hi)
def midi(m): return 440*2**((m-69)/12)
bed=np.zeros((2,N)); sfx=np.zeros((2,N))
def pad(t0,d,notes,g):
    t=tt(d); y=sum(np.sin(2*np.pi*midi(m)*t)+0.3*np.sin(2*np.pi*midi(m)*2*t) for m in notes)*(1+0.12*np.sin(2*np.pi*0.23*t)); put(bed,t0,y*env(len(t),1.5,2.0),g)
pad(0,30.5,[38,45,50,57],0.010)                   # tensão noturna (justificada pelo pedido estranho)
pad(28.5,13.4,[38,45,52,55,62],0.013)               # chegada ao terreno
put(bed,0,lp(noise(36.9),900)*0.010,1)             # ambiente de cidade à noite
put(bed,30.5,bp(noise(6.4),200,2200)*env(int(6.4*SR),0.4,0.6),0.012)
pad(40.4,3.4,[31,38,43],0.020)   # vento no terreno
for k in range(40):                                  # grilos no terreno
    t0=30.9+k*0.13; f0=4300+300*(k%3); t=tt(0.05); put(sfx,t0,np.sin(2*np.pi*f0*t)*env(len(t),0.003,0.03),0.012,(-1)**k*0.4)
def tick(f=1900,d=0.05): t=tt(d); return np.sin(2*np.pi*f*t)*np.exp(-90*t)+0.3*noise(d)*np.exp(-120*t)
def chime(f,d=0.5): t=tt(d); return (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2.01*t))*np.exp(-6*t)*env(len(t),0.003,0.1)
# celular
put(sfx,1.38,chime(1760,0.6),0.06); put(sfx,1.40,chime(2349,0.5),0.04)
for k in range(3): t=tt(0.12); put(sfx,1.38+0.2*k,np.sin(2*np.pi*170*t)*env(len(t),0.004,0.04)+0.3*lp(noise(0.12),400),0.07)
put(sfx,3.6,tick(2200,0.06),0.08); put(sfx,5.9,chime(1480,0.5),0.04)
# susto do mapa
t=tt(0.18); put(sfx,8.3,np.sin(2*np.pi*np.cumsum(420-230*(t/0.18))/SR)*env(len(t),0.01,0.06),0.05)
# relógio do app: um tique por segundo; mais urgente depois
for s in range(9,14): put(sfx,s+0.3,tick(1500,0.04),0.08)
put(sfx,11.45,bp(noise(0.25),400,3500)*np.sin(np.pi*tt(0.25)/0.25),0.05)   # popup
t=tt(0.4); put(sfx,12.5,lp(noise(0.4),500)*np.exp(-9*t),0.06)
# papel + carimbo
put(sfx,14.1,bp(noise(0.5),800,5000)*np.sin(np.pi*tt(0.5)/0.5)**2,0.06)
t=tt(0.35); put(sfx,14.62,np.sin(2*np.pi*70*t)*np.exp(-14*t)+0.4*lp(noise(0.35),300)*np.exp(-20*t),0.18)
# viseira (clack) + motor
t=tt(0.05); put(sfx,17.05,np.sin(2*np.pi*900*t)*np.exp(-70*t)+0.4*noise(0.05)*np.exp(-90*t),0.08)
def engine(d,f0,g=1.0,fc=700,rise=0.0):
    t=tt(d); fr=f0*(1+rise*t/d); ph=2*np.pi*np.cumsum(fr)/SR; am=0.6+0.4*np.sin(2*np.pi*np.cumsum(fr*0.5)/SR)
    return lp((np.sin(ph)+0.5*np.sin(2*ph)+0.25*np.sin(3*ph)+0.2*np.sign(np.sin(ph*0.5)))*am,fc)*g+0.1*lp(noise(d),500)
put(sfx,16.8,engine(0.95,52,1,500,0.1)*env(int(0.95*SR),0.05,0.05),0.07)        # liga
put(sfx,17.35,engine(11.0,70,1,900,1.1)*env(int(11.0*SR),0.2,0.8),0.085)       # rodando (acelera)
for tm in [18.2,19.0,25.5,26.2]: put(sfx,tm,bp(noise(0.4),300,2800)*np.sin(np.pi*tt(0.4)/0.4)**2,0.05)   # postes passando
# histórico: pop por linha
for i in range(11): put(sfx,20.75+0.1+i*0.19,tick(1250+50*i,0.05),0.07)
# freio e chegada
t=tt(0.6); put(sfx,29.3,bp(noise(0.6),1500,6000)*np.exp(-2.5*t)*np.sin(np.pi*np.clip(t/0.6,0,1)),0.04)
put(sfx,30.0,engine(0.8,48,1,400,-0.4)*env(int(0.8*SR),0.02,0.7),0.07)
# lâmpada: pisca (estalo + zumbido) e acende; depois nota de caixa de música na mesa; susto e fala
def click(tm,g=0.12): t=tt(0.04); put(sfx,tm,(noise(0.04)*np.exp(-90*t)+np.sin(2*np.pi*140*t)*np.exp(-60*t)),g)
def buzz(tm,d,g=0.04): t=tt(d); put(sfx,tm,(np.sin(2*np.pi*100*t)+0.5*np.sin(2*np.pi*200*t)+0.3*np.sign(np.sin(2*np.pi*50*t)))*env(len(t),0.01,0.05),g)
for tm in [34.20,34.40,34.55,34.62,34.75]: click(tm)
buzz(34.2,0.12); buzz(34.4,0.1); buzz(34.62,2.6,0.03)
for k,(dt,m) in enumerate([(0,76),(0.45,79),(0.9,81),(1.35,79)]):
    t=tt(1.5); put(sfx,36.3+dt,sum(a*np.sin(2*np.pi*midi(m+12)*mm*t)*np.exp(-d*t) for mm,a,d in [(1,1,3.2),(2.76,.3,6),(5.4,.12,9)])*env(len(t),0.002,0.1),0.05,0.15)
t=tt(0.5); put(sfx,38.45,bp(noise(0.5),200,1200)*np.sin(np.pi*t/0.5)**2,0.03)                  # pano/relógio ao levantar o braço
for k in range(6): put(sfx,38.7+k*0.5,tick(2000,0.03),0.04)                                    # relógio de pulso
t=tt(0.7); put(sfx,40.5,(np.sin(2*np.pi*60*t)*np.exp(-6*t)+0.5*lp(noise(0.7),250)*np.exp(-8*t)),0.22)   # susto do Nando
put(sfx,40.5,bp(noise(0.35),400,4000)*np.sin(np.pi*tt(0.35)/0.35)**2,0.06)
t=tt(0.9); put(sfx,41.1,np.sin(2*np.pi*55*t)*np.exp(-2.4*t)*0.8,0.16)                           # peso sob "Você demorou."
def wr(path,a):
    a=np.clip(a,-1,1); i16=(a.T*32767).astype(np.int16)
    with wave.open(path,'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(i16.tobytes())
wr("bed.wav",bed); wr("sfx.wav",sfx)
w=wave.open("guia.wav"); sr=w.getframerate(); x=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
y=np.interp(np.linspace(0,len(x)-1,int(len(x)*SR/sr)),np.arange(len(x)),x); v=np.zeros((2,N)); v[0,:len(y)]=y[:N]; v[1,:len(y)]=y[:N]; wr("voice.wav",v*0.9); print("ok")
